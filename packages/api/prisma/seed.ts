import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.messageAttachment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.friend.deleteMany();
  await prisma.connectionRequest.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();

  // Hash a default password for all users
  const defaultPassword = 'password123';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  console.log('👥 Creating users...');
  const users = await Promise.all([
    // Core users
    prisma.user.create({
      data: {
        username: 'alice',
        email: 'alice@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567890',
      },
    }),
    prisma.user.create({
      data: {
        username: 'bob',
        email: 'bob@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567891',
      },
    }),
    prisma.user.create({
      data: {
        username: 'charlie',
        email: 'charlie@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567892',
      },
    }),
    prisma.user.create({
      data: {
        username: 'diana',
        email: 'diana@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567893',
      },
    }),
    prisma.user.create({
      data: {
        username: 'eve',
        email: 'eve@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567894',
      },
    }),
    prisma.user.create({
      data: {
        username: 'frank',
        email: 'frank@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567895',
      },
    }),
    prisma.user.create({
      data: {
        username: 'grace',
        email: 'grace@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567896',
      },
    }),
    prisma.user.create({
      data: {
        username: 'henry',
        email: 'henry@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567897',
      },
    }),
    prisma.user.create({
      data: {
        username: 'ivy',
        email: 'ivy@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567898',
      },
    }),
    prisma.user.create({
      data: {
        username: 'jack',
        email: 'jack@example.com',
        password: hashedPassword,
        phoneNumber: '+1234567899',
      },
    }),
    // More users for variety
    prisma.user.create({
      data: {
        username: 'kate',
        email: 'kate@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'liam',
        email: 'liam@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'mia',
        email: 'mia@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'noah',
        email: 'noah@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'olivia',
        email: 'olivia@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'paul',
        email: 'paul@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'quinn',
        email: 'quinn@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'ruby',
        email: 'ruby@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'sam',
        email: 'sam@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'tina',
        email: 'tina@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'umar',
        email: 'umar@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'vera',
        email: 'vera@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'will',
        email: 'will@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'xara',
        email: 'xara@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'yuki',
        email: 'yuki@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'zoe',
        email: 'zoe@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'adam',
        email: 'adam@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'beth',
        email: 'beth@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'carl',
        email: 'carl@example.com',
        password: hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        username: 'debbie',
        email: 'debbie@example.com',
        password: hashedPassword,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create groups
  console.log('👨‍👩‍👧‍👦 Creating groups...');
  const groups = await Promise.all([
    prisma.group.create({
      data: {
        name: 'Tech Enthusiasts',
        description: 'A group for tech lovers',
        createdById: users[0].id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Book Club',
        description: 'Weekly book discussions',
        createdById: users[1].id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Travelers',
        description: 'Share travel experiences',
        createdById: users[2].id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Foodies',
        description: 'Food lovers unite',
        createdById: users[3].id,
      },
    }),
    prisma.group.create({
      data: {
        name: 'Fitness Group',
        description: 'Stay active together',
        createdById: users[4].id,
      },
    }),
  ]);

  console.log(`✅ Created ${groups.length} groups`);

  // Create group memberships
  console.log('👥 Adding group members...');
  const groupMemberships = [];
  
  // Tech Enthusiasts group - add many members
  for (let i = 0; i < 15; i++) {
    groupMemberships.push(
      prisma.groupMember.create({
        data: {
          userId: users[i].id,
          groupId: groups[0].id,
          role: i === 0 ? 'ADMIN' : 'MEMBER',
        },
      })
    );
  }

  // Book Club
  for (let i = 5; i < 12; i++) {
    groupMemberships.push(
      prisma.groupMember.create({
        data: {
          userId: users[i].id,
          groupId: groups[1].id,
          role: i === 5 ? 'ADMIN' : 'MEMBER',
        },
      })
    );
  }

  // Travelers
  for (let i = 10; i < 18; i++) {
    groupMemberships.push(
      prisma.groupMember.create({
        data: {
          userId: users[i].id,
          groupId: groups[2].id,
          role: i === 10 ? 'ADMIN' : 'MEMBER',
        },
      })
    );
  }

  // Foodies
  for (let i = 8; i < 15; i++) {
    groupMemberships.push(
      prisma.groupMember.create({
        data: {
          userId: users[i].id,
          groupId: groups[3].id,
          role: i === 8 ? 'ADMIN' : 'MEMBER',
        },
      })
    );
  }

  // Fitness Group
  for (let i = 15; i < 25; i++) {
    groupMemberships.push(
      prisma.groupMember.create({
        data: {
          userId: users[i].id,
          groupId: groups[4].id,
          role: i === 15 ? 'ADMIN' : 'MEMBER',
        },
      })
    );
  }

  await Promise.all(groupMemberships);
  console.log(`✅ Created ${groupMemberships.length} group memberships`);

  // Create connection requests
  console.log('📩 Creating connection requests...');
  const requests = [];

  // Create some pending requests
  for (let i = 0; i < 10; i++) {
    const requester = users[i];
    const recipient = users[(i + 5) % users.length];
    if (requester.id !== recipient.id) {
      requests.push(
        prisma.connectionRequest.create({
          data: {
            requesterId: requester.id,
            recipientId: recipient.id,
            status: 'PENDING',
          },
        })
      );
    }
  }

  // Create some accepted requests
  for (let i = 10; i < 20; i++) {
    const requester = users[i];
    const recipient = users[(i + 3) % users.length];
    if (requester.id !== recipient.id) {
      requests.push(
        prisma.connectionRequest.create({
          data: {
            requesterId: requester.id,
            recipientId: recipient.id,
            status: 'ACCEPTED',
            resolvedAt: new Date(),
          },
        })
      );
    }
  }

  // Create some rejected requests
  for (let i = 20; i < 25; i++) {
    const requester = users[i];
    const recipient = users[(i + 7) % users.length];
    if (requester.id !== recipient.id) {
      requests.push(
        prisma.connectionRequest.create({
          data: {
            requesterId: requester.id,
            recipientId: recipient.id,
            status: 'REJECTED',
            resolvedAt: new Date(),
          },
        })
      );
    }
  }

  await Promise.all(requests);
  console.log(`✅ Created ${requests.length} connection requests`);

  // Create friend relationships (for accepted requests)
  console.log('🤝 Creating friend relationships...');
  const friends = [];

  // Alice and Bob are friends
  friends.push(
    prisma.friend.create({
      data: {
        userId: users[0].id,
        friendId: users[1].id,
      },
    }),
    prisma.friend.create({
      data: {
        userId: users[1].id,
        friendId: users[0].id,
      },
    })
  );

  // Charlie and Diana are friends
  friends.push(
    prisma.friend.create({
      data: {
        userId: users[2].id,
        friendId: users[3].id,
      },
    }),
    prisma.friend.create({
      data: {
        userId: users[3].id,
        friendId: users[2].id,
      },
    })
  );

  // Eve and Frank are friends
  friends.push(
    prisma.friend.create({
      data: {
        userId: users[4].id,
        friendId: users[5].id,
      },
    }),
    prisma.friend.create({
      data: {
        userId: users[5].id,
        friendId: users[4].id,
      },
    })
  );

  // Grace and Henry are friends
  friends.push(
    prisma.friend.create({
      data: {
        userId: users[6].id,
        friendId: users[7].id,
      },
    }),
    prisma.friend.create({
      data: {
        userId: users[7].id,
        friendId: users[6].id,
      },
    })
  );

  // Ivy and Jack are friends
  friends.push(
    prisma.friend.create({
      data: {
        userId: users[8].id,
        friendId: users[9].id,
      },
    }),
    prisma.friend.create({
      data: {
        userId: users[9].id,
        friendId: users[8].id,
      },
    })
  );

  // Create more friend relationships
  for (let i = 10; i < 20; i += 2) {
    if (i + 1 < users.length) {
      friends.push(
        prisma.friend.create({
          data: {
            userId: users[i].id,
            friendId: users[i + 1].id,
          },
        }),
        prisma.friend.create({
          data: {
            userId: users[i + 1].id,
            friendId: users[i].id,
          },
        })
      );
    }
  }

  const createdFriends = await Promise.all(friends);
  console.log(`✅ Created ${createdFriends.length} friend relationships`);

  // Create messages (DM and group messages)
  console.log('💬 Creating messages...');
  const messages = [];

  // Create DM messages between friends
  const dmMessages = [
    { text: 'Hey! How are you?', sender: users[0], receiver: users[1] },
    { text: "I'm doing great! How about you?", sender: users[1], receiver: users[0] },
    { text: "Let's catch up this weekend!", sender: users[0], receiver: users[1] },
    { text: 'Sounds good!', sender: users[1], receiver: users[0] },
    { text: 'Did you finish the project?', sender: users[2], receiver: users[3] },
    { text: 'Yes! Just submitted it.', sender: users[3], receiver: users[2] },
    { text: 'Congratulations! 🎉', sender: users[2], receiver: users[3] },
    { text: 'Thanks! 😊', sender: users[3], receiver: users[2] },
    { text: 'Want to grab lunch?', sender: users[4], receiver: users[5] },
    { text: 'Sure, where?', sender: users[5], receiver: users[4] },
    { text: 'The usual place?', sender: users[4], receiver: users[5] },
    { text: 'Perfect! See you at 12.', sender: users[5], receiver: users[4] },
  ];

  for (const msg of dmMessages) {
    messages.push(
      prisma.message.create({
        data: {
          text: msg.text,
          senderId: msg.sender.id,
          receiverId: msg.receiver.id,
          messageType: 'TEXT',
        },
      })
    );
  }

  // Create group messages
  const groupMessages = [
    { text: 'Welcome to Tech Enthusiasts!', sender: users[0], group: groups[0] },
    { text: 'What are your favorite technologies?', sender: users[1], group: groups[0] },
    { text: 'I love React and Node.js!', sender: users[2], group: groups[0] },
    { text: 'TypeScript is my favorite', sender: users[3], group: groups[0] },
    { text: 'This week we are reading "The Great Gatsby"', sender: users[1], group: groups[1] },
    { text: 'Looking forward to the discussion!', sender: users[2], group: groups[1] },
    { text: 'Anyone traveling soon?', sender: users[2], group: groups[2] },
    { text: 'I am! Going to Japan next month', sender: users[3], group: groups[2] },
    { text: 'Recommend any good restaurants?', sender: users[3], group: groups[3] },
    { text: 'The new Italian place is amazing!', sender: users[4], group: groups[3] },
    { text: 'Who is up for a morning run?', sender: users[4], group: groups[4] },
    { text: 'Count me in!', sender: users[5], group: groups[4] },
    { text: 'Me too!', sender: users[6], group: groups[4] },
  ];

  for (const msg of groupMessages) {
    messages.push(
      prisma.message.create({
        data: {
          text: msg.text,
          senderId: msg.sender.id,
          groupId: msg.group.id,
          messageType: 'TEXT',
        },
      })
    );
  }

  // Create more random messages
  for (let i = 0; i < 50; i++) {
    const sender = users[Math.floor(Math.random() * users.length)];
    const isGroupMessage = Math.random() > 0.5;
    
    if (isGroupMessage && groups.length > 0) {
      const group = groups[Math.floor(Math.random() * groups.length)];
      messages.push(
        prisma.message.create({
          data: {
            text: `Random group message ${i + 1}`,
            senderId: sender.id,
            groupId: group.id,
            messageType: 'TEXT',
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
          },
        })
      );
    } else {
      // Find a friend for DM
      const friendIndex = Math.floor(Math.random() * createdFriends.length);
      const friend = createdFriends[friendIndex];
      const receiverId = friend.userId === sender.id ? friend.friendId : friend.userId;
      
      messages.push(
        prisma.message.create({
          data: {
            text: `Random DM message ${i + 1}`,
            senderId: sender.id,
            receiverId: receiverId,
            messageType: 'TEXT',
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last 7 days
          },
        })
      );
    }
  }

  const createdMessages = await Promise.all(messages);
  console.log(`✅ Created ${createdMessages.length} messages`);

  // Create message attachments for some messages
  console.log('📎 Creating message attachments...');
  const attachments = [];

  // Add attachments to some messages
  for (let i = 0; i < 20; i++) {
    const message = createdMessages[Math.floor(Math.random() * createdMessages.length)];
    attachments.push(
      prisma.messageAttachment.create({
        data: {
          url: `https://example.com/media/attachment-${i + 1}.jpg`,
          type: i % 4 === 0 ? 'IMAGE' : i % 4 === 1 ? 'VIDEO' : 'FILE',
          sizeBytes: Math.floor(Math.random() * 10000000) + 1000,
          width: i % 4 === 0 ? 1920 : null,
          height: i % 4 === 0 ? 1080 : null,
          durationMs: i % 4 === 1 ? Math.floor(Math.random() * 300000) : null,
          messageId: message.id,
        },
      })
    );
  }

  await Promise.all(attachments);
  console.log(`✅ Created ${attachments.length} message attachments`);

  console.log('✨ Seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Groups: ${groups.length}`);
  console.log(`   - Group Memberships: ${groupMemberships.length}`);
  console.log(`   - Connection Requests: ${requests.length}`);
  console.log(`   - Friends: ${createdFriends.length / 2} pairs`);
  console.log(`   - Messages: ${createdMessages.length}`);
  console.log(`   - Attachments: ${attachments.length}`);
  console.log('\n🔐 Default password for all users: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

