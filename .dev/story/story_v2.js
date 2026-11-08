/* Hollowmere: The Cold Crown -- storyline and quest data (v2).
   Data only. Region ids are "col,row" with row 0 in the north.
   Optional speaker fields: startSpeaker / doneSpeaker hold an npc id, or "" for the narrator.
   When absent, main-quest lines are spoken by the mentor and side-quest lines by the giver. */
const STORY2 = {
  "title": "Hollowmere: The Cold Crown",
  "tagline": "The frost came out of the wood three winters ago. Someone made it. Follow it home.",
  "mentor": {
    "name": "Idris Vane",
    "description": "A grey-bearded lamplighter who once served the Hollow King. He lights every lamp in the Yard by hand, and never says why so carefully."
  },
  "prologue": [
    "Easy now. You were lying in the snow at the edge of the wood. Most people who do that stay there.",
    "This is the Lantern Yard. I am Idris Vane. I light the lamps, and the lamps keep the frost off the doors.",
    "Three winters ago the frost came out of the wood. The dead came with it, and they answer to the Hollow King.",
    "He wears a crown of ice. I served him once, before he was hollow. I know what he can do.",
    "You have a sword and you are still standing. That makes you the best news this village has had in a year.",
    "Bandits hold the Edgewood road to the east. Start there. The wood will tell us the rest."
  ],
  "acts": [
    {"act": 1, "name": "The Ledger and the Frost"},
    {"act": 2, "name": "The Bells Remember"},
    {"act": 3, "name": "The Last Lamp"}
  ],
  "main": [
    {
      "id": "m1_edgewood",
      "act": 1,
      "title": "The Edge of the Wood",
      "objective": "Clear the bandit camps in the Edgewood.",
      "region": "2,2",
      "trigger": {"type": "clearRegion", "region": "2,2"},
      "startLines": [
        "The Edgewood road is the only way out of the Yard that the dead do not walk.",
        "Bandits have made it theirs. Clear the camps, and do not let the archers keep their distance."
      ],
      "doneLines": [
        "The camps are quiet. One of them kept a ledger. Names, dates, and a price beside each.",
        "These are Thornfield folk. Someone has been selling the living to the dead.",
        "The ledger is signed with a crow. Corvin Rook. He holds the old granary in Thornfield.",
        "Here. A little fire for the road. Point and let it go."
      ],
      "reward": {"xp": 100, "gold": 40, "spell": "fireball"}
    },
    {
      "id": "m2_tithe",
      "act": 1,
      "title": "The Tithe-Taker",
      "objective": "Find Corvin Rook in Thornfield and end his trade.",
      "region": "0,2",
      "trigger": {
        "type": "boss",
        "region": "0,2",
        "boss": {
          "name": "Corvin Rook, the Tithe-Taker",
          "type": "bandit",
          "taunt": [
            "Every farm out here still breathes because I pay the dead. What do you pay them?",
            "Kill me and they come for their tithe anyway. Go on, then."
          ],
          "deathLine": "Tell Thornfield I kept the wolves off. Tell them it cost less than it should have."
        }
      },
      "startLines": [
        "Corvin Rook sells Thornfield folk to the dead, and the dead leave his granary alone.",
        "Maybe he thinks that makes him a shepherd. Go and ask him."
      ],
      "doneLines": [
        "The granary was full. He fed half of Thornfield with it. The other half he sold.",
        "I would like to tell you he was a monster. He was a frightened man with a ledger.",
        "His buyers came across Black Water. The dead are being ferried somewhere. Find the ferrywoman."
      ],
      "reward": {"xp": 150, "gold": 60}
    },
    {
      "id": "m3_ferry",
      "act": 1,
      "title": "Black Water",
      "objective": "Find the ferrywoman at Black Water Fen.",
      "region": "0,1",
      "trigger": {"type": "talk", "npc": "ferryman"},
      "startLines": [
        "There is one ferry across Black Water, and one woman who still works it. Old Tamsin.",
        "She ferries anyone who pays. I have never asked what the dead pay her with."
      ],
      "doneSpeaker": "ferryman",
      "doneLines": [
        "The dead pay in coin from the old war. King's silver. I take it. Silver is silver.",
        "I row them north to the Whisperwood shore. They walk into the trees and do not come back.",
        "And you. I know your face. I rowed you across once, three winters back, with the King's army.",
        "Do not look at me like that. Faces blur. Take this shield. Some knight left it on my dock."
      ],
      "reward": {"xp": 150, "gold": 50, "weapon": "shield"}
    },
    {
      "id": "m4_whisper",
      "act": 1,
      "title": "Where the Frost Began",
      "objective": "Follow the dead into the heart of the Whisperwood.",
      "region": "1,1",
      "trigger": {
        "type": "boss",
        "region": "1,1",
        "boss": {
          "name": "Ysolde, the First Frost",
          "type": "wraith",
          "taunt": [
            "You smell of lamp oil. Did he send you? Of course he sent you.",
            "I was a queen once. Now I am the cold that keeps the door shut."
          ],
          "deathLine": "Tell Idris I forgive him. I never could manage it while I was alive."
        }
      },
      "startLines": [
        "The frost came out of the Whisperwood first. If the dead gather anywhere, it is there.",
        "Something old waits at the heart of it. The hermit calls it the Queen. Mind the dark orbs."
      ],
      "doneLines": [
        "Ysolde. Aldwin's queen. Her hall had the brightest lamps in the realm. I lit them.",
        "She forgave me. I do not know what for. Truly, I do not.",
        "The dead walk on toward Frostfang Pass. Halvard holds it. He was the King's sworn shield.",
        "Take what she left in the frost. It pushes the world away from you. Use it when they crowd you."
      ],
      "reward": {"xp": 250, "gold": 80, "spell": "push"}
    },
    {
      "id": "m5_halvard",
      "act": 2,
      "title": "The Unbent",
      "objective": "Defeat Halvard the Unbent at Frostfang Pass.",
      "region": "2,1",
      "trigger": {
        "type": "boss",
        "region": "2,1",
        "boss": {
          "name": "Halvard the Unbent",
          "type": "knight",
          "taunt": [
            "I swore an oath to the crown. You will not pass.",
            "Captain? No. The Captain died on the Vale road. You are only wearing his face."
          ],
          "deathLine": "The oath ends here. Ask your lamplighter who forged the crown."
        }
      },
      "startLines": [
        "Halvard the Unbent never broke an oath alive, and death has not changed him.",
        "He will not yield, so do not ask him to. The hunter at the pass knows the high trails."
      ],
      "doneLines": [
        "He called you Captain. The dead see strangely. Do not let it trouble you.",
        "The pass is open. Past the Fen stands Ashgrave Keep. Its bells rang for every death in the war.",
        "If the King has a weakness, the Keep's chronicle will name it. Go and read it.",
        "And take this. Halvard's storm. He would have wanted it spent on something better than a grave."
      ],
      "reward": {"xp": 350, "gold": 120, "spell": "lightning"}
    },
    {
      "id": "m6_bells",
      "act": 2,
      "title": "The Bells of Ashgrave",
      "objective": "Silence the Bellwarden and reach the chronicle in Ashgrave Keep.",
      "region": "0,0",
      "trigger": {
        "type": "boss",
        "region": "0,0",
        "boss": {
          "name": "Brother Osric, the Bellwarden",
          "type": "skeleton",
          "taunt": [
            "Every bell is a name. I ring them so the King remembers who died to hold the fire.",
            "There is a bell here with your name on it, Captain. It has waited a long time."
          ],
          "deathLine": "The last bell is yours. Read the chronicle. Then decide who you are."
        }
      },
      "startLines": [
        "Ashgrave rang a bell for every soldier who fell on the Vale road. Someone is still ringing them.",
        "The chronicle is in the bell hall. Get to it, whatever stands guard."
      ],
      "doneSpeaker": "",
      "doneLines": [
        "The chronicle is in the King's own hand. The ink is old and steady.",
        "When the red eclipse woke the Cinder in the Vale, I asked Idris for a way to hold it. He made me a crown of winter.",
        "It will freeze the fire, and me with it, and every soldier who died to buy the time. Idris wept. I made him do it.",
        "Beside the last page hangs the roll of the King's guard. The Captain is drawn there. The face is yours.",
        "Under it, in another hand: Rekindled with my last good lamp. Forgive me. I.V.",
        "In the silence of the bell hall, time itself feels slower. Something of the Bellwarden stays with you."
      ],
      "reward": {"xp": 450, "gold": 150, "spell": "slow"}
    },
    {
      "id": "m7_confession",
      "act": 2,
      "title": "The Lamplighter's Confession",
      "objective": "Return to the Lantern Yard and confront Idris.",
      "region": "1,2",
      "trigger": {"type": "talk", "npc": "idris"},
      "startLines": [
        "I know what you found in the bell hall. I can hear it in how quiet you are.",
        "Come back to the Yard. I will not make you ask twice."
      ],
      "doneSpeaker": "idris",
      "doneLines": [
        "Yes. I forged the crown. Aldwin asked for it, and I would do it again. The Cinder would have burned everything.",
        "Ysolde begged me not to. I did it anyway. That is what she forgave.",
        "You were the Captain of his guard. You died holding the Vale road so I could finish the crown.",
        "The crown is cracking. When it breaks the Cinder wakes, unless something kills its heart first.",
        "Only the dead can walk the Vale and the Throne road. So I lit a lamp in a dead man. I needed you.",
        "Hate me later. I will still be here. Go to the Cinder Vale first."
      ],
      "reward": {"xp": 200, "gold": 100}
    },
    {
      "id": "m8_cinder",
      "act": 3,
      "title": "The Heart of the Cinder",
      "objective": "Destroy the Cinder's heart in the Cinder Vale.",
      "region": "1,0",
      "trigger": {
        "type": "boss",
        "region": "1,0",
        "boss": {
          "name": "Ser Aurel, the Cinder Saint",
          "type": "knight",
          "taunt": [
            "The fire only asked to be loved. Your King gave it ice instead.",
            "Burn with me, Captain. You were always better at dying than living."
          ],
          "deathLine": "Ash. Only ash. The sun is just the sun again."
        }
      },
      "startLines": [
        "The Cinder Vale is where you died. The ground still remembers the heat.",
        "Ser Aurel was the King's marshal. He walked into the fire and came out kneeling to it. Its heart beats in him."
      ],
      "doneLines": [
        "The heart is out. The red sky is going plain grey. I never thought I would be glad of grey.",
        "There is nothing left under the crown to keep frozen. The seal on the Hollow Throne is breaking.",
        "Aldwin has waited three winters. Let us not make him wait any longer."
      ],
      "reward": {"xp": 600, "gold": 200},
      "unlocks": "2,0"
    },
    {
      "id": "m9_road",
      "act": 3,
      "title": "The Road of Kneeling Dead",
      "objective": "Walk the frozen road into the Hollow Throne.",
      "region": "2,0",
      "trigger": {"type": "enter", "region": "2,0"},
      "startLines": [
        "The Throne road is open. Every soldier who held the Vale is kneeling along it.",
        "They are waiting for their Captain. Walk through them. They will not stop you."
      ],
      "doneLines": [
        "There. Second rank, the tall one. Your sergeant. He laughed louder than anyone in the army.",
        "I will be at the steps with you. Whatever happens when the crown breaks, I will be there."
      ],
      "reward": {"xp": 300, "gold": 100}
    },
    {
      "id": "m10_crown",
      "act": 3,
      "title": "The Cold Crown",
      "objective": "Break the Hollow King's crown.",
      "region": "2,0",
      "trigger": {
        "type": "boss",
        "region": "2,0",
        "boss": {
          "name": "The Hollow King",
          "type": "brute",
          "taunt": [
            "Captain. He brought you back to kill me. Of course he did.",
            "I held the fire for three winters. Kneel, and hold the cold with me."
          ],
          "deathLine": "Is it spring, Idris? Tell me it is spring."
        }
      },
      "startLines": [
        "There he is. Aldwin Hollow. He was a kind king. Remember that, even now.",
        "Break the crown. Do not hesitate on my account, or on his."
      ],
      "doneLines": [
        "It is spring, Aldwin. Nearly. Rest now.",
        "The crown is breaking. Do you feel it? The dead are lying down. All of them.",
        "No. Not you. Not yet. Hold still, Captain. I have one lamp left."
      ],
      "reward": {"xp": 1000, "gold": 500}
    }
  ],
  "regions": {
    "1,2": {
      "name": "The Lantern Yard",
      "enterFirst": ["Lamps on every post, and every one of them lit. The frost stops at the edge of their light."],
      "enter": ["Back in the Yard. The lamps are still burning.", "Smell that? Marta has the stew on.", "Home, or the nearest thing to it."],
      "loreTips": [
        "Lamplighters once had the King's ear. Now they keep the frost off the doors.",
        "The dead have never set foot in the Lantern Yard. Nobody is quite sure why.",
        "Rest in the Yard to recover. The lamps keep watch so you do not have to."
      ]
    },
    "0,2": {
      "name": "Thornfield",
      "enterFirst": ["Thornfield. The best barley in the realm, once. Half the fields are frozen now, and the other half are scared."],
      "enter": ["The scarecrows are watching again.", "Thornfield wind. Wet straw and woodsmoke.", "Mind the furrows. Frozen ruts break ankles."],
      "loreTips": [
        "Thornfield farmers bury their dead in the fields, so they can keep working beside them.",
        "The old granary once held a year of grain for the whole valley.",
        "A Thornfield scarecrow wears its maker's oldest coat, for luck."
      ]
    },
    "2,2": {
      "name": "Edgewood",
      "enterFirst": ["The Edgewood. Bandits like it. The trees hide the road, and the dead rarely come this far south."],
      "enter": ["Watch the treeline. Archers like the high roots.", "Smoke ahead means a camp.", "Quiet woods are lying woods."],
      "loreTips": [
        "Most Edgewood bandits were farmers three winters ago.",
        "Bandit archers keep their distance. Close the gap, or raise a shield.",
        "The Edgewood road was the King's highway before it was anyone's hiding place."
      ]
    },
    "0,1": {
      "name": "Black Water Fen",
      "enterFirst": ["Black Water Fen. The water is so still it looks like glass, until something moves under it."],
      "enter": ["Stay on the boards. The mud keeps what it takes.", "Listen for the ferry bell.", "The reeds are hissing. Something is walking in them."],
      "loreTips": [
        "The village of Lowmere lies under the Fen. On still nights you can hear its bell.",
        "Old Tamsin has worked the Black Water ferry for forty years.",
        "Skeletons are slow in the Fen mud. Use it."
      ]
    },
    "1,1": {
      "name": "Whisperwood",
      "enterFirst": ["The Whisperwood. This is where the frost came from. The trees here whisper names.", "Do not answer them."],
      "enter": ["The whispering has started again.", "The trees are not talking to you. Keep walking.", "Deeper in, the frost on the bark grows thicker."],
      "loreTips": [
        "Queen Ysolde planted the Whisperwood's silver birches on her wedding day.",
        "Wraiths fire dark orbs. Keep moving and they will miss.",
        "The hermit of the Whisperwood was once a scholar at the King's court."
      ]
    },
    "2,1": {
      "name": "Frostfang Pass",
      "enterFirst": ["Frostfang Pass. The snow here never melts, not even at noon. Keep your blood moving."],
      "enter": ["Wind off the ridge. Head down, blade up.", "The aurora is out over Frostfang.", "Brutes on the switchbacks. Listen for the scrape."],
      "loreTips": [
        "Halvard the Unbent held Frostfang Pass for nine days against the Cinder's first fire.",
        "Brutes swing wide and slow. Step inside the arc.",
        "Pass hunters read the snow like a ledger."
      ]
    },
    "0,0": {
      "name": "Ashgrave Keep",
      "enterFirst": ["Ashgrave Keep. Storm on the walls, and the bells are ringing for no one."],
      "enter": ["Thunder over the courtyard. The bells answer it.", "Do not count the bells. You will not like the number.", "Wet stone, cold air, and the dead on the stairs."],
      "loreTips": [
        "Ashgrave rang a bell for every soldier who died on the Vale road. There are three hundred bells.",
        "The Keep's chronicle was written in the King's own hand.",
        "Armored knights guard their front. Strike from the side, or break the guard first."
      ]
    },
    "1,0": {
      "name": "The Cinder Vale",
      "enterFirst": ["The Cinder Vale. The sky is red, and the ground is still warm from a fire three winters old."],
      "enter": ["The ash is ankle-deep. Some of it was people.", "Red sky, black ground. The Vale has not changed.", "Heat shimmer on the ridge. Something out there is still burning."],
      "loreTips": [
        "The red eclipse woke the Cinder beneath the Vale. It has not set since.",
        "The King's army made its last stand on the Vale road.",
        "Fire does not care whose side you were on."
      ]
    },
    "2,0": {
      "name": "The Hollow Throne",
      "enterFirst": ["The Hollow Throne. Ice over black stone, and the dead kneeling all the way up the steps."],
      "enter": ["The kneeling dead do not look up.", "Colder than anywhere you have ever stood.", "Every step of this road is a soldier's grave."],
      "loreTips": [
        "The Hollow Throne was sealed the day the crown was forged.",
        "King Aldwin Hollow was crowned twice. Once with gold, once with winter.",
        "The crown of ice is the frost's heart. Break the crown, and the winter ends."
      ]
    }
  },
  "npcs": [
    {
      "id": "idris",
      "name": "Idris Vane",
      "role": "lamplighter",
      "region": "1,2",
      "look": {"skin": "#d9b89a", "hair": "#b8b4ac", "shirt": "#4a4038", "pants": "#2e2a26", "accessory": "beard"},
      "barks": [
        "Oil, wick, flint. The whole trade fits in a pocket. The hard part is coming back every night.",
        "Keep your guard high. The dead are patient, and patience beats speed more often than it should.",
        "I used to light the lamps in the King's hall. Two hundred of them, every dusk.",
        "If you hear me talking to the lamps, no, you did not.",
        "Eat something. You look like a man who forgets to.",
        "The frost hates a steady flame. So do I, some days. It shows you everything.",
        "Wren keeps stealing my wick-hook. I keep letting her."
      ],
      "afterLines": {
        "m2_tithe": "Corvin Rook. I sold that man lamp oil once. He always paid exact.",
        "m4_whisper": "Do the birches still whisper? They used to sing, when she was alive.",
        "m7_confession": "You can hate me and still eat supper. Most of the village manages both.",
        "m8_cinder": "Grey sky. I had forgotten what an ordinary day looks like."
      }
    },
    {
      "id": "bryn",
      "name": "Bryn Hallow",
      "role": "blacksmith",
      "region": "1,2",
      "look": {"skin": "#c08a64", "hair": "#3b2a20", "shirt": "#6b3a2a", "pants": "#3a3430", "accessory": "apron"},
      "barks": [
        "Mind the anvil. It has broken more toes than the dead have.",
        "Good steel remembers the hand that made it. Bad steel remembers nothing, like my brother.",
        "Bring me iron, not compliments. I have plenty of compliments.",
        "That edge is a disgrace. Come here. No, closer. Hold still.",
        "My Teodor swung a hammer like a poet. I swing one like a debt collector.",
        "If it bends, I will fix it. If it breaks, you did something stupid. I will still fix it.",
        "The forge is the warmest place in the Yard. That is why the cat lives here."
      ],
      "afterLines": {
        "m1_edgewood": "Bandit blades. Cheap iron and cheaper men. Bring me better.",
        "m5_halvard": "Halvard's sword was forged in this Yard. My grandmother's work. Shame what he did with it.",
        "m6_bells": "Three hundred bells. My Teodor has one of them, somewhere.",
        "m10_crown": "If Teodor is lying still now, I can stop setting a plate for him."
      }
    },
    {
      "id": "odo",
      "name": "Odo Pellam",
      "role": "merchant",
      "region": "1,2",
      "look": {"skin": "#e2c09e", "hair": "#7a4a2a", "shirt": "#2f5a4a", "pants": "#4a3a2a", "accessory": "hat"},
      "barks": [
        "Blades, shields, the finest spears this side of the frost. Also the only spears this side of the frost.",
        "Every price is fair. Some are fairer than others. Those are for friends.",
        "No haggling with the dead. They never have exact change.",
        "This axe belonged to a hero. Possibly. It certainly belonged to someone.",
        "I lost a cart in the Fen once. I still dream about that cart.",
        "Gold is cold comfort, friend. But it is the only comfort that spends.",
        "Buy two and I will throw in my sincerest regards."
      ],
      "afterLines": {
        "m2_tithe": "Corvin owed me forty crowns. I suppose I write that off now.",
        "m5_halvard": "The pass is open? Then the north road is open. I could kiss you. I will not.",
        "m8_cinder": "Red sky gone, eh? There go my sunset tours. Not that anyone booked one.",
        "m10_crown": "Spring prices start tomorrow. Higher. Joy costs extra."
      }
    },
    {
      "id": "marta",
      "name": "Marta Quill",
      "role": "innkeeper",
      "region": "1,2",
      "look": {"skin": "#d6a882", "hair": "#8a2f1f", "shirt": "#7a5a3a", "pants": "#3a2e28", "accessory": "apron"},
      "barks": [
        "Stew is hot, beds are cold, and the ale is whatever Fennick did not drink.",
        "Wipe your boots. I do not care what you killed. I care about my floor.",
        "The Last Wick has never closed. Not for frost, not for the dead, not for Fennick's singing.",
        "You look like a ghost. Sit. Eat. Then look like a ghost with a full stomach.",
        "Odo says my prices are robbery. Odo sells rusty spears to children.",
        "Idris lit every lamp in this Yard. I cooked every supper. Guess who works harder.",
        "I hear everything in this room. Most of it is lies. The rest is worse."
      ],
      "afterLines": {
        "m1_edgewood": "Edgewood road open? Good. I can get salt again.",
        "m3_ferry": "Tamsin still rowing? That old heron will outlive us all.",
        "m7_confession": "I heard shouting from the lamplighter's house. You want stew or a talk? Stew, then.",
        "m10_crown": "Free drinks tonight. Tonight only. Do not tell Fennick."
      }
    },
    {
      "id": "aldous",
      "name": "Father Aldous",
      "role": "priest",
      "region": "1,2",
      "look": {"skin": "#cfa58a", "hair": "#d8d0c0", "shirt": "#3a3a52", "pants": "#26262e", "accessory": "hood"},
      "barks": [
        "The gods of Hollowmere are listening. I am fairly sure. I would like to be more sure.",
        "I have prayed for spring every morning for three winters. I suspect a scheduling problem.",
        "Bless you. It cannot hurt. I have checked.",
        "The chapel roof leaks onto the altar. I have decided it is a sign. I have not decided of what.",
        "If you meet a god out there, ask them to write.",
        "Faith is a lamp, friend. Mine needs a new wick.",
        "The dead never enter the chapel. I wish I knew if that was the gods or the draught."
      ],
      "afterLines": {
        "m4_whisper": "The Queen? I gave her the rites myself. I suppose they did not take.",
        "m6_bells": "Three hundred bells for three hundred souls. And the gods let them ring alone.",
        "m7_confession": "Idris came to confession. First time in thirty years. I can tell you nothing. Obviously.",
        "m10_crown": "The dead are at rest. Perhaps that was the gods. Perhaps it was you. I will thank both."
      }
    },
    {
      "id": "wren",
      "name": "Wren",
      "role": "child",
      "region": "1,2",
      "look": {"skin": "#e8c4a4", "hair": "#c46a2a", "shirt": "#8aa04a", "pants": "#5a4a3a", "accessory": "none"},
      "barks": [
        "Are you a knight? You smell like a knight. Like iron and old soup.",
        "When I grow up I will light all the lamps. Even the ones in the wood.",
        "Idris says I am not allowed his wick-hook. I have his wick-hook.",
        "Do the fire trick again. Do it at Fennick. He is asleep.",
        "I saw a skeleton once. It waved. I waved back. Was that wrong?",
        "Marta says eating crusts makes you brave. I eat everyone's crusts.",
        "Fight me. I am very dangerous. I bite."
      ],
      "afterLines": {
        "m1_edgewood": "Did you fight a hundred bandits? I told everyone it was a hundred.",
        "m5_halvard": "Was the Unbent knight scary? I would not have been scared. Only a bit.",
        "m7_confession": "Why is everyone whispering about you? Are you a ghost? Ghosts can still play, right?",
        "m10_crown": "Idris said I can keep his hook now. I wish he had just let me borrow it."
      }
    },
    {
      "id": "sedge",
      "name": "Gorran Sedge",
      "role": "farmer",
      "region": "1,2",
      "look": {"skin": "#b88a62", "hair": "#5a4a32", "shirt": "#8a6a3a", "pants": "#4a5a3a", "accessory": "hat"},
      "barks": [
        "Frost on the barley again. You can hear it crack when the sun comes up.",
        "My scarecrow walked to the well last night. I did not move it. Nobody moved it.",
        "Thornfield soil is the best in the realm. Ask anyone. Ask the soil.",
        "A farmer plants in hope and harvests in arguments.",
        "Three winters with no spring. My cows have forgotten what grass is. So have I.",
        "Going past the fields? Close the gate. Not for the dead. For the goats.",
        "My father said never trust a man who will not eat turnips. I have never trusted Odo."
      ],
      "afterLines": {
        "m2_tithe": "Corvin sold my neighbours. He also fed my children last winter. I do not know what to feel.",
        "m4_whisper": "The frost pulled back from my east field this morning. Only a little. Was that you?",
        "m10_crown": "Planting tomorrow. First time in three years. I may weep into the furrows."
      }
    },
    {
      "id": "hesk",
      "name": "Captain Hesk",
      "role": "guard",
      "region": "1,2",
      "look": {"skin": "#a8785a", "hair": "#2a2a2a", "shirt": "#5a5a62", "pants": "#3a3a40", "accessory": "helmet"},
      "barks": [
        "Halt. No, carry on. I just like saying halt.",
        "The Yard watch is me, two farm boys and a dog. The dog is the best of us.",
        "Keep your blade sheathed in the Yard. Unless something dead walks in. Then by all means.",
        "I served at Frostfang under the Unbent. He taught me to stand still. I have been doing it since.",
        "The lamps hold the line. I stand next to them looking stern.",
        "Bandits on the road, dead in the wood, and Wren in the armoury again. Busy day.",
        "If you see a crow with a red plume, that is my helmet's. I want it back."
      ],
      "afterLines": {
        "m1_edgewood": "Road is clear. First time in a year. I will try not to get used to it.",
        "m5_halvard": "Halvard was the best of us. Thank you for not letting him stand there forever.",
        "m7_confession": "Captain of the King's guard, eh? Should I salute? I am not going to. Just asking.",
        "m9_road": "Kneeling dead all along the throne road. Gods. I knew some of those men."
      }
    },
    {
      "id": "nell",
      "name": "Nell Ashby",
      "role": "weaver",
      "region": "1,2",
      "look": {"skin": "#dcb494", "hair": "#6a5a4a", "shirt": "#5a3a5a", "pants": "#3a2e3a", "accessory": "shawl"},
      "barks": [
        "I keep weaving. If I stop, I start thinking.",
        "Tam used to sit right there and tangle my yarn. On purpose. Little devil.",
        "Thornfield wool is the softest in the realm. When there are sheep.",
        "Mind the loom. It bites worse than Wren.",
        "Every shawl in the Yard is mine. Every hole in them is Fennick's fault.",
        "If you see a red-haired boy with his father's chin out there, do not hurt him. Please.",
        "I made this blue from fen-berries. Tamsin trades them. She drives a hard bargain."
      ],
      "afterLines": {
        "m1_edgewood": "Was there a red-haired boy in those camps? No? Then he is alive somewhere. Good.",
        "m2_tithe": "Corvin is dead. If Tam was with him, where did he go?",
        "m10_crown": "Tam is coming home for the planting. I wove him three shawls. He will hate all of them."
      }
    },
    {
      "id": "fennick",
      "name": "Fennick Dray",
      "role": "gravedigger",
      "region": "1,2",
      "look": {"skin": "#c49a7a", "hair": "#4a3a2a", "shirt": "#4a4a3a", "pants": "#2e2e26", "accessory": "beard"},
      "barks": [
        "Dug the same grave four times this month. Same fellow. He keeps getting up.",
        "I am not drunk. I am grieving. Professionally.",
        "Every grave in the Yard is six feet deep. The dead in the wood never had the courtesy.",
        "Marta and I were married once. It was a short war.",
        "If I die, bury me face down. If I get up, I will be digging the wrong way.",
        "Shovel, lantern, flask. A gravedigger's holy trinity.",
        "The dead are restless because nobody digs properly anymore. Also the King. Mostly the King."
      ],
      "afterLines": {
        "m4_whisper": "Fewer of my customers getting up this week. Business is improving.",
        "m6_bells": "Three hundred bells. Three hundred graves never dug. That is a lot of overtime.",
        "m10_crown": "They are lying still. All of them. I can finally finish a job."
      }
    },
    {
      "id": "moll",
      "name": "Old Moll",
      "role": "herbalist",
      "region": "1,2",
      "look": {"skin": "#d2aa8a", "hair": "#e8e4dc", "shirt": "#4a6a3a", "pants": "#3a3a2a", "accessory": "shawl"},
      "barks": [
        "Frostcap for chills, goldroot for wounds, nettle for people who annoy me.",
        "Father Aldous drinks my sleep tea every night. Then he says the gods kept him awake.",
        "Hesk is sweet on Marta. Marta is sweet on Fennick. Fennick is sweet on his flask.",
        "Eat this. No, do not ask what it is.",
        "I knew the Queen when she was a girl. She hated mushrooms. Never trust a girl who hates mushrooms.",
        "The Whisperwood used to grow the best herbs. Now it grows wraiths. Poor yield.",
        "Seventy winters I have seen. Only three of them were this long."
      ],
      "afterLines": {
        "m3_ferry": "Tamsin knew your face? Tamsin cannot see past the end of her own oar.",
        "m4_whisper": "Ysolde. Poor lamb. I hope it was quick.",
        "m7_confession": "I always knew Idris carried something. Nobody lights lamps that carefully unless he is sorry.",
        "m10_crown": "Frostcap will not grow now the frost is gone. Worth it."
      }
    },
    {
      "id": "ferryman",
      "name": "Old Tamsin",
      "role": "ferrywoman",
      "region": "0,1",
      "look": {"skin": "#b48a6a", "hair": "#9a9a9a", "shirt": "#3a4a4a", "pants": "#2a3030", "accessory": "hood"},
      "barks": [
        "One coin to cross. Two if you talk. Three if you sing.",
        "The Fen gives back what it takes. Eventually. Usually missing bits.",
        "Forty years on this water. I have rowed kings, beggars and one very confused goat.",
        "Do not lean over the side. Lowmere is down there, and it gets lonely.",
        "The dead pay in old silver. The living pay in excuses.",
        "Hear that bell under the water? Ignore it. I always do.",
        "My oar is older than you. Mind your manners around it."
      ],
      "afterLines": {
        "m3_ferry": "Still looks like your face. I will stop mentioning it. No, I will not.",
        "m7_confession": "So you were one of them. I rowed you across living. Strange to row you back.",
        "m10_crown": "No dead to ferry now. Just fish and fools. I prefer the fish."
      }
    },
    {
      "id": "hermit",
      "name": "Brother Moss",
      "role": "hermit",
      "region": "1,1",
      "look": {"skin": "#c8a080", "hair": "#7a7a6a", "shirt": "#4a5a3a", "pants": "#3a3a2a", "accessory": "beard"},
      "barks": [
        "Shh. The trees are telling me about you. They are not impressed.",
        "I left the court to study silence. The Whisperwood has been very disappointing.",
        "Moss on the north side, frost on every side. Navigation is difficult lately.",
        "I wrote a book on crowns once. Nobody read it. That was the problem.",
        "The birches whisper the Queen's name. They miss her. So do I.",
        "Do not eat the blue mushrooms. Do not eat the red ones either. Eat bread.",
        "A man who forges a crown out of winter should expect a long winter."
      ],
      "afterLines": {
        "m4_whisper": "The Queen is quiet now. The birches are singing again. Very badly.",
        "m6_bells": "You have read the chronicle. I can see it on you. I copied half of it, you know.",
        "m10_crown": "The wood is thawing. It drips on me all day. I have never been happier."
      }
    },
    {
      "id": "hunter",
      "name": "Kaja Thorne",
      "role": "hunter",
      "region": "2,1",
      "look": {"skin": "#a87050", "hair": "#1a1a1a", "shirt": "#6a4a2a", "pants": "#3a3a30", "accessory": "hood"},
      "barks": [
        "Tracks in the snow say three brutes and one very lost rabbit.",
        "Stay downwind. The dead cannot smell you, but I can.",
        "My father hunted this pass. His father too. None of us ever caught a warm day.",
        "Wraiths leave no tracks. That is how I know they are cheating.",
        "Halvard let me pass every morning. Never said a word. Never once looked at me.",
        "Eat when you can, sleep when you can, run when I say.",
        "The aurora is green tonight. My father said green means the King is sleeping."
      ],
      "afterLines": {
        "m5_halvard": "Halvard is down? I left bread at his post every morning. He never ate it.",
        "m8_cinder": "The snow is softer this week. Wet. Like it remembers how to melt.",
        "m10_crown": "The pass is thawing. Now I have to learn to track in mud. Ugh."
      }
    }
  ],
  "sidequests": [
    {
      "id": "sq_scarecrow",
      "giver": "sedge",
      "title": "The Scarecrow Walks",
      "type": "boss",
      "params": {
        "region": "0,2",
        "boss": {
          "name": "Old Straw",
          "type": "skeleton",
          "taunt": ["Gorran? Gorran, you left the gate open again.", "These fields are mine. I am still working them."],
          "deathLine": "Tell the boy to plant the barley deep. Frost cannot reach deep."
        }
      },
      "minLevel": 1,
      "offerLines": [
        "My scarecrow walks at night. Up and down the east field, like it is checking the rows.",
        "I made it from my father's coat after we buried him out there. Do not say what you are thinking.",
        "Put it down for me. Gently, if you can. It still carries his woodaxe."
      ],
      "progressLine": "It walks the east field of Thornfield. You will know it by the coat.",
      "doneLines": [
        "It was him, was it not. Still checking the rows.",
        "Keep the axe. He would rather it chopped something than rusted in a field.",
        "Plant deep. He used to say that. I had forgotten."
      ],
      "reward": {"xp": 120, "gold": 30, "weapon": "axe"}
    },
    {
      "id": "sq_tam1",
      "giver": "nell",
      "title": "A Boy in the Edgewood",
      "type": "fetch",
      "params": {"item": "Tam's carved fox", "region": "2,2"},
      "minLevel": 1,
      "offerLines": [
        "My Tam ran off to the Edgewood bandits last autumn. Said he would send grain home. He did, twice.",
        "He carved a little wooden fox for luck. He never went anywhere without it.",
        "If it is still out there, so is he. Or so was he. Please. Find it."
      ],
      "progressLine": "Tam's carved fox is somewhere in the Edgewood. It is small. Look near the old camps.",
      "doneLines": [
        "That is his. He scratched something on the base. Gone to the Fen. Do not worry. Ha. Do not worry.",
        "He is alive. Or he was, when he wrote it. That is more than I had this morning."
      ],
      "reward": {"xp": 100, "gold": 20}
    },
    {
      "id": "sq_tam2",
      "requires": "sq_tam1",
      "giver": "nell",
      "title": "A Letter for the Ferry",
      "type": "deliver",
      "params": {"to": "ferryman", "item": "Nell's letter"},
      "minLevel": 2,
      "offerLines": [
        "If he went to the Fen, Tamsin will know. Nobody crosses that water without her seeing.",
        "Take her this letter for him. Tell him nobody is angry. Lie, if you must."
      ],
      "progressLine": "Bring Nell's letter to Old Tamsin at the Black Water ferry.",
      "doneSpeaker": "ferryman",
      "doneLines": [
        "A letter for Tam? Red hair, all elbows? He has been bailing my boat since the granary fell.",
        "He walked out on Corvin the night they sold folk to the dead. Good lad. Bad at bailing.",
        "I will give it to him. Tell his mother he eats. Tell her he is coming home in spring."
      ],
      "reward": {"xp": 180, "gold": 40, "skillPoint": 1}
    },
    {
      "id": "sq_wren",
      "giver": "wren",
      "title": "Da's Lamp-Hook",
      "type": "fetch",
      "params": {"item": "a brass lamp-hook marked W", "region": "0,2"},
      "minLevel": 1,
      "offerLines": [
        "My da was Idris's apprentice. He went to light the Thornfield road lamps and did not come back.",
        "His brass hook is still out there. It has a W on it. For Wren. He scratched it himself.",
        "If I have it I am a real lamplighter. Idris cannot say no to a real lamplighter."
      ],
      "progressLine": "Wren's father fell on the Thornfield road. Look for a brass hook with a W on it.",
      "doneLines": [
        "That is it. That is his. It is heavier than I thought.",
        "Here. Three coppers and a drawing of you. It is a good drawing. You have a big nose in it."
      ],
      "reward": {"xp": 80, "gold": 3, "skillPoint": 1}
    },
    {
      "id": "sq_marta",
      "giver": "marta",
      "title": "Supper for a Stubborn Man",
      "type": "deliver",
      "params": {"to": "fennick", "item": "a pot of hot stew"},
      "minLevel": 1,
      "offerLines": [
        "Fennick has not come in from the graveyard in two days. The fool will freeze out there.",
        "Take him this stew. Do not tell him it is from me. Tell him it fell off a cart."
      ],
      "progressLine": "Bring Marta's stew to Fennick at the graveyard before it goes cold.",
      "doneSpeaker": "fennick",
      "doneLines": [
        "Fell off a cart, did it. With my name chalked on the lid. In her hand.",
        "She still puts the bay leaf in. She knows I hate the bay leaf. She knows I eat it anyway.",
        "Tell her thank you. No. Tell her it was too salty. She will know what I mean."
      ],
      "reward": {"xp": 60, "gold": 15}
    },
    {
      "id": "sq_doubt1",
      "giver": "aldous",
      "title": "The Candle in the Wood",
      "type": "fetch",
      "params": {"item": "the shrine candle of First Light", "region": "1,1"},
      "minLevel": 2,
      "offerLines": [
        "There is a shrine in the Whisperwood where I first heard the gods. Its candle never went out.",
        "If it still burns after three winters of frost, I will believe again. If it is dark, I will know.",
        "Bring me whatever you find. Do not tell me first. Let me see it myself."
      ],
      "progressLine": "Find the candle at the old shrine in the Whisperwood and bring it to Father Aldous.",
      "doneLines": [
        "It is lit. Three winters, no keeper, and it is still lit.",
        "Of course, Moll says it is half beeswax. That would explain a great deal.",
        "No. I will take it. A man may choose to be a fool about the right things."
      ],
      "reward": {"xp": 200, "gold": 50, "skillPoint": 1}
    },
    {
      "id": "sq_doubt2",
      "requires": "sq_doubt1",
      "giver": "aldous",
      "title": "The Unquiet Congregation",
      "type": "kill",
      "params": {"enemy": "wraith", "count": 6, "region": "any"},
      "minLevel": 5,
      "offerLines": [
        "The wraiths that drift through the wood and the keep. Some of them sang in my choir.",
        "I could not save them living. Now a prayer needs a blade behind it.",
        "Put six of them to rest. The chapel's old mace is yours when you do. It has hung on my altar too long."
      ],
      "progressLine": "Lay six wraiths to rest, wherever they drift. Father Aldous prays for each one.",
      "doneLines": [
        "Six. I rang the chapel bell for each of them. Someone should.",
        "Take the mace. Brother Halric carried it through the plague years. Use it on the right things."
      ],
      "reward": {"xp": 400, "gold": 80, "weapon": "mace"}
    },
    {
      "id": "sq_hermit",
      "giver": "hermit",
      "title": "Quiet the Wood",
      "type": "clear",
      "params": {"region": "1,1"},
      "minLevel": 3,
      "offerLines": [
        "The Whisperwood is too loud. The dead crash through the ferns and argue with the trees.",
        "I came here for silence. Clear them out, and I will tell you a story about a crown."
      ],
      "progressLine": "Clear the dead from the Whisperwood so Brother Moss can hear himself think.",
      "doneLines": [
        "Ah. Silence. Or nearly. The birches are humming.",
        "The story. A lamplighter once asked me how to forge winter. I told him. I have been sorry since.",
        "I am not the one who owes you the rest of it. He is."
      ],
      "reward": {"xp": 250, "gold": 60, "skillPoint": 1}
    },
    {
      "id": "sq_hunter",
      "giver": "hunter",
      "title": "The Dogs of Frostfang",
      "type": "kill",
      "params": {"enemy": "brute", "count": 3, "region": "2,1"},
      "minLevel": 4,
      "offerLines": [
        "Three brutes came down the ridge last month and took my dogs. All five of them.",
        "I named every one of those dogs. Badly, but I named them.",
        "Kill the three, and I will give you my father's boar spear. It has more reach than your temper."
      ],
      "progressLine": "Hunt three brutes on Frostfang Pass for Kaja. She is counting.",
      "doneLines": [
        "Three. Good. I will not pretend it brings back Mutt, or Other Mutt.",
        "Take the spear. Keep the point low and let them come onto it. That is all hunting is."
      ],
      "reward": {"xp": 350, "gold": 70, "weapon": "spear"}
    },
    {
      "id": "sq_forge1",
      "giver": "bryn",
      "title": "Star-Iron",
      "type": "fetch",
      "params": {"item": "a lump of star-iron", "region": "2,1"},
      "minLevel": 4,
      "offerLines": [
        "Before the war I started a greatsword for my husband Teodor. He marched before I finished it.",
        "It needs star-iron. A piece of fallen star lies somewhere on Frostfang Pass. Bring me a chunk."
      ],
      "progressLine": "Find star-iron on Frostfang Pass and bring it to Bryn at the forge.",
      "doneLines": [
        "That is the stuff. Feel how cold it is. It drinks the heat out of your hand.",
        "That is the edge. Next it needs a guard. Come back when you are ready for Ashgrave."
      ],
      "reward": {"xp": 300, "gold": 60}
    },
    {
      "id": "sq_forge2",
      "requires": "sq_forge1",
      "giver": "bryn",
      "title": "Bell-Bronze",
      "type": "fetch",
      "params": {"item": "a shard of Teodor's bell", "region": "0,0"},
      "minLevel": 6,
      "offerLines": [
        "Every soldier who fell on the Vale road got a bell at Ashgrave. Teodor has one.",
        "Bring me a shard of it. The bronze will make the guard. He will be in the sword, then. Somehow.",
        "Do not look at me like that. Smiths may be sentimental. It is in the guild charter."
      ],
      "progressLine": "Find Teodor Hallow's bell in Ashgrave Keep and bring Bryn a shard of it.",
      "doneLines": [
        "His name is still on it. Teodor Hallow, third rank. He hated the third rank. Said it smelled of the second.",
        "One thing left. Star-iron needs real fire to temper, and only one real fire is left. The Cinder Vale."
      ],
      "reward": {"xp": 450, "gold": 90, "skillPoint": 1}
    },
    {
      "id": "sq_forge3",
      "requires": "sq_forge2",
      "giver": "bryn",
      "title": "The Kiln of the Vale",
      "type": "boss",
      "params": {
        "region": "1,0",
        "boss": {
          "name": "Gorm the Kilnheart",
          "type": "brute",
          "taunt": ["A smith's errand-runner. I am the forge now.", "Come closer. Let me temper you."],
          "deathLine": "Cold. Finally cold. I was so tired of burning."
        }
      },
      "minLevel": 8,
      "offerLines": [
        "A brute crawled into the old army kiln in the Cinder Vale and came out burning.",
        "Kill it. What is left of its fire will temper Teodor's sword. Then the sword is yours."
      ],
      "progressLine": "Kill Gorm the Kilnheart in the Cinder Vale so Bryn can temper the greatsword.",
      "doneLines": [
        "There. Star-iron edge, bell-bronze guard, tempered in the last fire in the realm.",
        "It was his. Now it is yours. He would rather it was swung than hung on a wall.",
        "Bring it back nicked and I will be very, very angry. Go on."
      ],
      "reward": {"xp": 800, "gold": 150, "weapon": "greatsword"}
    }
  ],
  "deathLines": [
    "The cold takes you. The lamp gutters, but it does not go out.",
    "Down in the frost again. Get up. The dead do not get to keep you twice.",
    "I have watched better fighters fall and stay down. Do not be one of them.",
    "The Hollow King keeps what he takes. Not you. Not while I have oil.",
    "Breathe. Even if you do not need to. It helps."
  ],
  "levelUpLines": [
    "You are getting quicker. The dead will notice.",
    "Well struck. Halvard would have nodded. He never nodded.",
    "Stronger. I can see it in how you stand.",
    "Good. Now spend it on something that keeps you alive.",
    "Your flame burns brighter. Careful. Bright things draw moths."
  ],
  "ending": [
    "The crown broke like river ice in spring, and the cold went out of Hollowmere in one long breath.",
    "Across the realm the dead lay down. Halvard's men, the Queen's wraith, the soldiers of the Vale road. All of them, at last.",
    "You should have fallen with them. Idris knew that. He had always known.",
    "He pressed his lantern to your chest and gave you the last of his flame. It was the only light he had left.",
    "They buried the lamplighter in the Lantern Yard, under the first lamp he ever lit.",
    "Thornfield planted in the spring. Wren lights the lamps now, badly, with a brass hook marked W.",
    "Some nights you feel his flame turn over in your chest, like an old man settling down to sleep.",
    "Hollowmere is thawing. The road is yours."
  ],
  "credits": "Hollowmere: The Cold Crown. For the lamplighters, and everyone who kept a light on."
};
