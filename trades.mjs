import { Client, GatewayIntentBits } from "discord.js";
import express from 'express'; // Import express
import fetch from 'node-fetch';
import { config } from 'dotenv';

// Load environment variables from .env
config();

const port = process.env.PORT || 3000; // Use the PORT environment variable if available, or use port 3000 as a default

const app = express(); // Create an instance of express

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Now you can define your routes and middleware using 'app'

// Access the bot token from environment variables
const botToken = process.env.DISCORD_TOKEN;

const bot = new Client({ intents: [
  GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.Guilds, 
  GatewayIntentBits.MessageContent, 
  GatewayIntentBits.GuildMembers // Add this intent to capture messages from bots
] });

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}`);
});

// Event listener for when a message is received
bot.on('messageCreate', (message) => {
  if (message.channel.id === '1153928749218279456') {
    // Check if the message is an embedded message
    if (message.embeds.length > 0) {
      message.embeds.forEach((embed) => {
        // Access embedded message content
        const data = {
          content: `\nDescription: ${embed.description}`,
          author: message.author.username,
          timestamp: message.createdTimestamp,
        };

        // Log the received data
        console.log(data);

        // Send the message data to the API server
        fetch('https://sfx-backend.onrender.com/bot-messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      });
    } else {
      // Handle regular text messages
      const data = {
        content: message.content,
        author: message.author.username,
        timestamp: convertToEST(message.createdTimestamp),
      };

      // Function to format a timestamp to EST
      function convertToEST(timestamp) {
        const date = new Date(timestamp);
        const estOffset = -5 * 60 * 60 * 1000; // EST offset is -5 hours from UTC
      
        // Adjust the date by adding the EST offset
        date.setTime(date.getTime() + estOffset);
      
        // Format the date as a string
        return date.toISOString(); // Adjust this format as needed
      }

      // Log the received data
      console.log(data);

      // Send the message data to the API server
      fetch('https://sfx-backend.onrender.com/bot-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    }
  }
}); 


app.get('/', (req, res) => {
  res.send('Hello, World!'); // Replace with the desired response
});

// Log in to the Discord server using your bot's token
bot.login(botToken);