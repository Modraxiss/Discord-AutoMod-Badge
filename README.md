<img src="assets/Repo Banner.png" alt="banner" align="center">

## What Does It Do?

- Automatically creates and configures moderation rules for Discord servers.
- Helps users set up 15 servers with the bot to fulfill Discord's AutoMod badge requirements.
- Provides an easy-to-use slash command (`/automod`) to start the setup process.
- Ensures the bot stays active for at least 12 hours to meet Discord’s criteria.

## Who Created This?

This bot is developed by **Modraxis**.  
For more information or to contribute, check out the [GitHub Repository](https://github.com/Modraxiss/Discord-AutoMod-Badge).

# Setup Instructions

Follow these simple steps to get the bot up and running:

## Prerequisites

1. **Install Node.js**  
    Download and install Node.js from the [official Node.js website](https://nodejs.org/).

2. **Get Your Discord Bot Token**  
    - Go to the [Discord Developer Portal](https://discord.com/developers/applications).
    - Create a new bot and copy its token.

## Installation Steps

1. **Clone the Repository**

    ```bash
    git clone https://github.com/Modraxiss/Discord-AutoMod-Badge.git
    cd Discord-AutoMod-Badge
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment Variables**
    - Open the `.env` file in any text editor.
    - Add your bot token like this:

    ```env
    token=YOUR_BOT_TOKEN
    ```

4. **Run the Bot**

    ```bash
    node index.js
    ```

5. **Create 15 Servers**
    - Create 15 Discord servers.
    - Invite the bot to each server using the invite link shown in the console.

6. **Set Up AutoMod Rules**
    - In each server, use the `/automod` command to automatically configure moderation settings.

7. **Stay Active for 12 Hours**
    - Keep the bot running in all servers for at least 12 hours to meet the badge requirement.

# Important Notes

- **Bot Permissions**: Make sure the bot has **Manage Server** permissions.
- **Server Access**: You must be the **Owner** or have **Administrator** permissions in all servers.
- **Activity Duration**: The bot needs to stay online for at least **12 hours** across all servers.
- **Security Warning**: Never share your bot token or `.env` file with anyone.

# Preview

<img src="assets/Profile Preview.png" alt="preview">

# License

This project is open-source and available under the MIT License.
For more details, see the [LICENSE](/LICENSE) file.

# Support

Facing issues or have questions?  
Feel free to [open an issue](https://github.com/Modraxiss/Discord-AutoMod-Badge/issues) on the GitHub repository.

Happy Automating!
