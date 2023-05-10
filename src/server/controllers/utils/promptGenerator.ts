export function generatePrompt(profile: string) {
    const prompt = `Destiny 2 has these activities: 
- Cooperative (PvE): Raids, Dungeons, Casual PvE, Endgame PvE.
- Competetive (PvP): Crucible, Trials of Osiris, Gambit.

Also Destiny has a system that's called Commendations.
Commendations are cards that you can give to players after you finished an activity in Destiny 2 with them.

Commendations are split into 4 categories: Leadership, Mastery, Ally and Fun.
Each category has its' cards. Here's a description of all of the cards:

Leadership:
- "Perceptive"
Given for: strong situational awareness and observant of the team's needs.
Activities: Raids, Dungeons
- "Knowledgeable"
Given for: being seasoned and well-informed of the activity, equipment, and classes of Destiny 2.
Activities: Raids, Dungeons, Endgame PvE

Mastery:
- "Playmaker"
Given for: leading the offense for the team.
Activities: Crucible
- "Primeval Instinct"
Given for: leading the offense for the team.
Activities: Gambit
- "Heroic"
Given for: showcasing courage in the face of danger and pushed the team to success.
Activities: Raids, Dungeons
- "Pacesetter"
Given for: being a key strategist, communicating well, and rallying the team together.
Activities: Trials of Osiris

Ally:
- "Indispensable"
Given for: being essential to the team's success.
Activities: Endgame PvE
- "Selfless"
Given for: putting the needs of others above self and leaving no one behind.
Activities: Raids, Dungeons
- "Thoughtful"
Given for: being considerate, kind, and helpful
Activities: Casual PvE
- "Patient and Considerate"
Given for: grounding the team with fortitude and compassion.
Activities: Raids, Dungeons

Fun:
- "Joy Bringer"
Given for: enriching the game with their presence.
Activities: Casual PvE
- "Level-headed"
Given for: keeping it cool despite how intense things may be.
Activities: Crucible, Gambit
- "Saint's Favorite"
Given for: putting the needs of others above self and leaving no one behind.
Activities: Trials of Osiris

Now I will give you a player's profile, that will have: 
- commendations total score
- amounts of how many different cards in each category the player has received
- activity points that indicate how much commendations were received in corresponding activities

I want you to write me a short characteristic of this player, no more that 300 characters. 
Characteristic should indicate the player's affinity towards cooperative or competetive activities (PvE or PvP) based on given numbers.

Here's the player's profile:
${profile}

Your answer should be in this format:
SUMMARY:
<characteristic>
EXPERIENCED IN:
<activities in which he has most points in activityPoints>`;

    //console.log("MESSAGE SENT TO CHAT GPT: \n" + debugPrompt);
    return prompt;
}
