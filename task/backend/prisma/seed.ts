import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Kullanıcıları idempotent ekle (unique: username, email)
  const usersData = [
    { name: 'Ayşe Yılmaz',  username: 'ayse',   email: 'ayse@example.com' },
    { name: 'Mehmet Demir', username: 'mehmet', email: 'mehmet@example.com' },
    { name: 'Zeynep Kaya',  username: 'zeynep', email: 'zeynep@example.com' },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { username: u.username }, // veya { email: u.email }
      update: {},
      create: u,
    });
  }

  // Kullanıcıları çek
  const allUsers = await prisma.user.findMany({ orderBy: { id: 'asc' } });
  if (allUsers.length === 0) {
    console.log('Kullanıcı bulunamadı, post eklenmedi.');
    return;
  }

  // Basit yardımcı: aynı başlık + userId varsa ekleme
  async function ensurePost(userId: number, title: string) {
    const exists = await prisma.post.findFirst({ where: { userId, title } });
    if (!exists) {
      await prisma.post.create({ data: { userId, title } });
    }
  }

  // Gönderiler (kullanıcı sayısına göre güvenli ekleme)
  await ensurePost(allUsers[0].id, 'Merhaba Dünya');
  if (allUsers[1]) await ensurePost(allUsers[1].id, 'İlk gönderim');
  if (allUsers[2]) await ensurePost(allUsers[2].id, 'Bugün neler yaptım?');

  console.log('✅ Seed tamam');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
