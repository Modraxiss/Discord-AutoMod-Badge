const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');
const createEmbed = require('../helperFunction/createEmbed.js');

module.exports = {
    autoDeferReply: true,
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Sets up auto moderation rules for your server'),

    async execute(interaction, client) {
        const guild = interaction.guild;
        const name = `AutoMod by "${client.user.username}"`;
        const isCommunityEnabled = guild.features.includes("COMMUNITY");

        const stepNames = [
            "Check Permissions",
            "Remove Old Rules",
            "Add New Rules",
            "Confirm Setup"
        ];

        let phaseEmbeds = [null, null, null, null];
        let globalPhaseDetails = [null, null, null, null];
        let phaseButtons = [null, null, null, null];

        function createButtonRow() {
            const row = new ActionRowBuilder();
            for (let i = 0; i < stepNames.length; i++) {
                if (phaseButtons[i]) {
                    row.addComponents(phaseButtons[i]);
                }
            }
            return row;
        }

        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        async function updatePhaseDetails() {
            const embedsToSend = phaseEmbeds.filter(e => e !== null);
            const row = createButtonRow();
            const components = row.components.length > 0 ? [row] : [];
            await interaction.editReply({ embeds: embedsToSend, components });
        }

        const initialEmbed = createEmbed(
            "Please wait while we set up your server's auto moderation rules.",
            "Starting AutoMod Setup",
            "blurple"
        );

        await interaction.followUp({ embeds: [initialEmbed] });
        await delay(2000);
        phaseEmbeds[0] = initialEmbed;
        await interaction.editReply({ embeds: [createEmbed(null, "...", "blurple")] });

        function setPhaseButton(index, style, disabled, loading) {
            const Button = new ButtonBuilder()
                .setCustomId(`step_${index}`)
                .setLabel(stepNames[index])
                .setStyle(style)
                .setDisabled(disabled);

            phaseButtons[index] = Button;
        }

        function enablePhaseButtons(enabled) {
            for (let i = 0; i < stepNames.length; i++) {
                if (phaseButtons[i]) {
                    if (enabled) {
                        phaseButtons[i].setStyle(ButtonStyle.Success).setDisabled(false);
                    } else {
                        phaseButtons[i].setDisabled(true);
                    }
                }
            }
            if (enabled) createCollector();
        }

        function createCollector() {
            const collectorFilter = i => i.customId.startsWith("step_") && i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

            collector.on("collect", async i => {
                const stepIndex = parseInt(i.customId.split("_")[1]);
                const details = globalPhaseDetails[stepIndex] || "No details available.";
                await i.reply({
                    embeds: [createEmbed(details, `${stepNames[stepIndex]} Details`, "blurple")],
                    flags: MessageFlags.Ephemeral
                });
            });

            collector.on("end", async () => {
                enablePhaseButtons(false);
                await updatePhaseDetails();
            });
        }

        async function runPhase(index, stepTitle, stepFunction) {
            let phaseLog = [];
            phaseEmbeds[index] = createEmbed(null, stepTitle, "blurple", false, true);
            setPhaseButton(index, ButtonStyle.Danger, true, false);
            await updatePhaseDetails();

            let success = await stepFunction(phaseLog);
            await delay(2000);
            globalPhaseDetails[index] = phaseLog.join("\n") || "No details available.";
            const title = success ? `✅ ${stepTitle} - Completed` : `❌ ${stepTitle} - Failed`;
            phaseEmbeds[index] = createEmbed("", title, success ? "green" : "red");
            setPhaseButton(index, ButtonStyle.Primary, true, false);
            await updatePhaseDetails();
            return success;
        }

        const verify = await runPhase(0, "Check Permissions", async (phaseLog) => {
            let missing = 0;
            if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
                phaseLog.push("You do not have the `Administrator` permission.");
                missing++;
            } else {
                phaseLog.push("You have the `Administrator` permission.");
            }
            if (!interaction.appPermissions.has(PermissionFlagsBits.ManageGuild)) {
                phaseLog.push("I do not have the `Manage Server` permission needed for setup.");
                missing++;
            } else {
                phaseLog.push("I have the `Manage Server` permission.");
            }
            phaseLog.push(isCommunityEnabled ? "Note: Community features are enabled." : "Community features are disabled.");
            return missing === 0;
        });

        if (!verify) {
            enablePhaseButtons(true);
            await updatePhaseDetails();
            return;
        }

        const deletionSuccess = await runPhase(1, "Remove Old Rules", async (phaseLog) => {
            const existingRules = await guild.autoModerationRules.fetch();
            if (existingRules.size > 0) {
                phaseLog.push(`Found ${existingRules.size} existing rule(s).`);
                for (const rule of existingRules.values()) {
                    try {
                        if (rule.triggerType === 6) continue;
                        if (isCommunityEnabled && rule.triggerType === 5) {
                            if (rule.creatorId !== interaction.client.user.id) {
                                phaseLog.push("A mention-spam rule (not set up by me) was found. Disabling it.");
                                await rule.edit({ name: `⚠️ Not set by "${client.user.username}"`, enabled: false });
                            } else {
                                await rule.edit({ name });
                                phaseLog.push("Updated my existing mention-spam rule.");
                            }
                            continue;
                        }
                        await rule.delete();
                        phaseLog.push(`Removed rule: ${rule.name}`);
                    } catch (err) {
                        console.error("Error removing rule:", err);
                        phaseLog.push(`Failed to remove rule: ${rule.name}`);
                    }
                    await delay(2000);
                }
            } else {
                phaseLog.push("No old auto moderation rules found.");
            }
            return true;
        });

        if (!deletionSuccess) {
            enablePhaseButtons(true);
            await updatePhaseDetails();
            return;
        }

        const rulesDefinition = [
            { name, triggerType: 1, triggerMetadata: { keywordFilter: ["insult"] }, maxCount: 6 },
            { name, triggerType: 3, maxCount: 1 },
            { name, triggerType: 4, triggerMetadata: { presets: [1, 2, 3] }, maxCount: 1 },
        ];
        if (!isCommunityEnabled) {
            rulesDefinition.push({ name, triggerType: 5, triggerMetadata: { mentionTotalLimit: 5 }, maxCount: 1 });
        }

        const creationSuccess = await runPhase(2, "Add New Rules", async (phaseLog) => {
            for (const rule of rulesDefinition) {
                for (let i = 0; i < rule.maxCount; i++) {
                    try {
                        await guild.autoModerationRules.create({
                            name: rule.name,
                            creatorId: interaction.client.user.id,
                            enabled: true,
                            eventType: 1,
                            triggerType: rule.triggerType,
                            triggerMetadata: rule.triggerMetadata || {},
                            actions: [{ type: 1, metadata: { customMessage: name } }]
                        });
                        phaseLog.push(`Added rule for trigger type ${rule.triggerType}.`);
                    } catch (err) {
                        console.error("Error adding rule:", err);
                        phaseLog.push(`Failed to add rule for trigger type ${rule.triggerType}.`);
                    }
                    await delay(2000);
                }
            }
            phaseLog.push("All new rules have been added.");
            return true;
        });

        if (!creationSuccess) {
            enablePhaseButtons(true);
            await updatePhaseDetails();
            return;
        }

        const verificationSuccess = await runPhase(3, "Confirm Setup", async (phaseLog) => {
            const verifiedRules = await guild.autoModerationRules.fetch();
            const expectedRules = rulesDefinition.map(rule => ({
                triggerType: rule.triggerType,
                requiredCount: rule.maxCount
            }));
            for (const expected of expectedRules) {
                let count = 0;
                verifiedRules.forEach(r => {
                    if (r.triggerType === expected.triggerType && r.creatorId === interaction.client.user.id) {
                        count++;
                    }
                });
                if (count >= expected.requiredCount) {
                    phaseLog.push(`Rule for trigger type ${expected.triggerType} verified: ${count}/${expected.requiredCount}.`);
                } else {
                    phaseLog.push(`Rule for trigger type ${expected.triggerType} missing: ${count}/${expected.requiredCount}.`);
                }
            }
            return true;
        });

        if (!verificationSuccess) {
            enablePhaseButtons(true);
            await updatePhaseDetails();
            return;
        }

        enablePhaseButtons(true);
        await updatePhaseDetails();

        await interaction.followUp({
            embeds: [
                createEmbed(
                    "Your server's auto moderation rules have been set up and verified successfully!\n\n" +
                    `These rules are configured to help you earn the Discord AutoMod badge for this bot (@${client.user.displayName}).\n\n` +
                    "Thank you for using my STUFF!\n\n" +
                    `<@${interaction.user.id}> / *<t:${Math.floor(new Date().getTime() / 1000)}:R>*`,
                    "AutoMod Setup Complete",
                    "green",
                    true
                )
            ]
        });
    }
};
