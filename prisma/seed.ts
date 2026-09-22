import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEMO_PASSWORD = "ourodeminas123";

function daysFromNow(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function hoursAgo(hours: number): Date {
  const date = new Date();
  date.setHours(date.getHours() - hours);
  return date;
}

async function main() {
  console.log("Limpando dados anteriores...");
  await prisma.notification.deleteMany();
  await prisma.activityLog.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.generatedMaterial.deleteMany();
  await prisma.materialTemplate.deleteMany();
  await prisma.representative.deleteMany();
  await prisma.brandAsset.deleteMany();
  await prisma.mediaFile.deleteMany();
  await prisma.publication.deleteMany();
  await prisma.calendarEvent.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.demandComment.deleteMany();
  await prisma.demandChecklistItem.deleteMany();
  await prisma.demandVersion.deleteMany();
  await prisma.demandAttachment.deleteMany();
  await prisma.demand.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("Criando usuários...");
  const [anaCarolina, bruno, carla, diego, fernanda, gustavo, juliana, marcos] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Ana Carolina Silva",
        email: "ana.carolina@ourominas.com.br",
        passwordHash,
        role: "MARKETING",
        jobTitle: "Marketing",
        department: "Marketing",
        status: "ATIVO",
        lastAccessAt: hoursAgo(2),
      },
    }),
    prisma.user.create({
      data: {
        name: "Bruno Almeida",
        email: "bruno.almeida@ourominas.com.br",
        passwordHash,
        role: "REPRESENTANTE",
        jobTitle: "Representante comercial",
        department: "Comercial",
        status: "ATIVO",
        lastAccessAt: hoursAgo(5),
      },
    }),
    prisma.user.create({
      data: {
        name: "Carla Mendes",
        email: "carla.mendes@ourominas.com.br",
        passwordHash,
        role: "DESIGNER",
        jobTitle: "Designer gráfica",
        department: "Marketing",
        status: "ATIVO",
        lastAccessAt: hoursAgo(24),
      },
    }),
    prisma.user.create({
      data: {
        name: "Diego Souza",
        email: "diego.souza@ourominas.com.br",
        passwordHash,
        role: "FINANCEIRO",
        jobTitle: "Analista financeiro",
        department: "Financeiro",
        status: "ATIVO",
        lastAccessAt: hoursAgo(3),
      },
    }),
    prisma.user.create({
      data: {
        name: "Fernanda Lima",
        email: "fernanda.lima@ourominas.com.br",
        passwordHash,
        role: "DIRETORIA",
        jobTitle: "Diretora",
        department: "Diretoria",
        status: "ATIVO",
        lastAccessAt: hoursAgo(1),
      },
    }),
    prisma.user.create({
      data: {
        name: "Gustavo Rocha",
        email: "gustavo.rocha@ourominas.com.br",
        passwordHash,
        role: "ADMIN",
        jobTitle: "Administrador do sistema",
        department: "TI",
        status: "ATIVO",
        lastAccessAt: hoursAgo(0),
      },
    }),
    prisma.user.create({
      data: {
        name: "Juliana Costa",
        email: "juliana.costa@ourominas.com.br",
        passwordHash,
        role: "REPRESENTANTE",
        jobTitle: "Representante comercial",
        department: "Comercial",
        status: "INATIVO",
        lastAccessAt: daysFromNow(-7),
      },
    }),
    prisma.user.create({
      data: {
        name: "Marcos Pinto",
        email: "marcos.pinto@ourominas.com.br",
        passwordHash,
        role: "MARKETING",
        jobTitle: "Analista de marketing",
        department: "Marketing",
        status: "ATIVO",
        lastAccessAt: hoursAgo(4),
      },
    }),
  ]);

  console.log("Criando produtos...");
  const productData = [
    { name: "Palha Italiana", sku: "OM-PAL", category: "Chocolate & biscoito", imageUrl: "/images/produtos/palha-italiana.webp" },
    { name: "Pé de Moça", sku: "OM-PDM", category: "Amendoim & leite", imageUrl: "/images/produtos/pe-de-moca.webp" },
    { name: "Brigadeiro", sku: "OM-BRI", category: "Chocolate & afeto", imageUrl: "/images/produtos/brigadeiro.webp" },
    { name: "Pingo Bel", sku: "OM-PIN", category: "O sabor da casa", imageUrl: "/images/produtos/pingo-bel.webp" },
    { name: "Beijo", sku: "OM-BEI", category: "Coco & delicadeza", imageUrl: "/images/produtos/beijo.webp" },
    { name: "Beijo com Chocolate", sku: "OM-BCH", category: "Coco & chocolate", imageUrl: "/images/produtos/beijo-com-chocolate.webp" },
    { name: "Beijo de Moça", sku: "OM-BDM", category: "Amendoim & coco", imageUrl: "/images/produtos/beijo-de-moca.webp" },
  ];
  const products = await Promise.all(productData.map((p) => prisma.product.create({ data: p })));

  console.log("Criando campanhas...");
  const [campMaes, campLancamento, campMesDoce, campJunina, campInstitucional] = await Promise.all([
    prisma.campaign.create({
      data: { name: "Dia das Mães — Regional SP", description: "Campanha sazonal para o Dia das Mães na região Sudeste.", startDate: daysFromNow(-30), endDate: daysFromNow(-5), color: "#b3392c", status: "CONCLUIDA" },
    }),
    prisma.campaign.create({
      data: { name: "Lançamento — Nova Palha Italiana", description: "Campanha de lançamento da nova receita de Palha Italiana.", startDate: daysFromNow(-10), endDate: daysFromNow(20), color: "#c97b2e", status: "EM_ANDAMENTO" },
    }),
    prisma.campaign.create({
      data: { name: "Mês do Doce Mineiro", description: "Conteúdo institucional celebrando a tradição mineira.", startDate: daysFromNow(1), endDate: daysFromNow(30), color: "#3f8a4f", status: "PLANEJADA" },
    }),
    prisma.campaign.create({
      data: { name: "Festa Junina 2026", description: "Campanha temática de festa junina para PDV e redes sociais.", startDate: daysFromNow(15), endDate: daysFromNow(45), color: "#d4a017", status: "PLANEJADA" },
    }),
    prisma.campaign.create({
      data: { name: "Institucional 2026", description: "Materiais institucionais recorrentes da marca.", startDate: daysFromNow(-60), endDate: null, color: "#6e407d", status: "EM_ANDAMENTO" },
    }),
  ]);

  console.log("Criando demandas (kanban)...");
  let demandSeq = 130;
  const nextCode = () => `DOM-2026-${String(++demandSeq).padStart(4, "0")}`;

  type DemandSeed = {
    title: string;
    description: string;
    status: string;
    priority: string;
    materialType: string;
    formats: string[];
    requester: typeof anaCarolina;
    assignee?: typeof anaCarolina;
    campaign?: typeof campMaes;
    dueInDays: number;
    department: string;
    region?: string;
  };

  const demandSeeds: DemandSeed[] = [
    { title: "Campanha Dia das Mães — Regional SP", description: "Peças para feed e stories do Dia das Mães na região Sudeste, com foco em Pingo Bel e Beijo.", status: "NOVA", priority: "ALTA", materialType: "Feed Instagram", formats: ["Feed 1080x1350", "Story 1080x1920"], requester: fernanda, campaign: campMaes, dueInDays: 6, department: "Marketing", region: "Regional SP" },
    { title: "Briefing — Reel receita Palha Italiana", description: "Vídeo curto mostrando o preparo artesanal da Palha Italiana para o Reels.", status: "BRIEFING", priority: "MEDIA", materialType: "Reel", formats: ["Story 1080x1920"], requester: marcos, campaign: campLancamento, dueInDays: 9, department: "Marketing" },
    { title: "Banner tela — loja Shopee", description: "Banner principal da loja oficial na Shopee, com os 7 sabores.", status: "BRIEFING", priority: "BAIXA", materialType: "Banner", formats: ["Banner", "Tela"], requester: anaCarolina, campaign: campInstitucional, dueInDays: 12, department: "Marketing" },
    { title: "Artes para ponto de venda — Julho", description: "Cartazes e wobblers para reforço de ponto de venda no mês de julho.", status: "EM_PRODUCAO", priority: "MEDIA", materialType: "Material PDV", formats: ["A4", "A3", "Impresso"], requester: fernanda, assignee: carla, campaign: campInstitucional, dueInDays: 4, department: "Comercial" },
    { title: "Catálogo digital — linha completa", description: "Catálogo em PDF com os 7 sabores para envio a novos representantes.", status: "EM_PRODUCAO", priority: "MEDIA", materialType: "Catálogo", formats: ["A4"], requester: anaCarolina, assignee: carla, campaign: campInstitucional, dueInDays: 7, department: "Marketing" },
    { title: "Post Instagram — Beijo com Chocolate", description: "Post carrossel destacando o lançamento do Beijo com Chocolate.", status: "PARA_APROVACAO", priority: "ALTA", materialType: "Feed Instagram", formats: ["Feed 1080x1350"], requester: marcos, assignee: carla, campaign: campLancamento, dueInDays: 2, department: "Marketing" },
    { title: "Vídeo institucional — fábrica", description: "Vídeo institucional mostrando o processo de produção artesanal.", status: "PARA_APROVACAO", priority: "MEDIA", materialType: "Vídeo", formats: ["Story 1080x1920", "Tela"], requester: fernanda, assignee: carla, campaign: campInstitucional, dueInDays: 5, department: "Diretoria" },
    { title: "Embalagem 400g — ajuste de arte", description: "Revisão da arte da embalagem de 400g conforme apontamento da diretoria.", status: "AJUSTES", priority: "URGENTE", materialType: "Embalagem", formats: ["Impresso"], requester: fernanda, assignee: carla, campaign: campInstitucional, dueInDays: 1, department: "Diretoria" },
    { title: "Cartaz Festa Junina — PDV", description: "Cartaz temático de festa junina para pontos de venda parceiros.", status: "APROVADO", priority: "MEDIA", materialType: "Cartaz", formats: ["A3", "Impresso"], requester: anaCarolina, assignee: carla, campaign: campJunina, dueInDays: 14, department: "Marketing" },
    { title: "Manual do Representante 2026", description: "Atualização do manual com novos materiais de apoio comercial.", status: "APROVADO", priority: "BAIXA", materialType: "Apresentação", formats: ["A4"], requester: anaCarolina, campaign: campInstitucional, dueInDays: 20, department: "Comercial" },
    { title: "Degustação em PDV — Regional Sudeste", description: "Material de apoio para ação de degustação em pontos de venda.", status: "AGENDADO", priority: "MEDIA", materialType: "Evento", formats: ["A4", "Impresso"], requester: fernanda, campaign: campMesDoce, dueInDays: 23, department: "Comercial", region: "Regional Sudeste" },
    { title: "LANÇAMENTO — Nova Palha Italiana", description: "Peça oficial de lançamento publicada no feed e stories.", status: "PUBLICADO", priority: "ALTA", materialType: "Feed Instagram", formats: ["Feed 1080x1350", "Story 1080x1920"], requester: marcos, assignee: carla, campaign: campLancamento, dueInDays: -1, department: "Marketing" },
    { title: "Story — bastidores da produção", description: "Sequência de stories mostrando bastidores da produção artesanal.", status: "PUBLICADO", priority: "BAIXA", materialType: "Story", formats: ["Story 1080x1920"], requester: anaCarolina, assignee: carla, campaign: campInstitucional, dueInDays: -3, department: "Marketing" },
    { title: "Banner Black Friday 2025", description: "Banner promocional da campanha de Black Friday do ano anterior.", status: "ARQUIVADO", priority: "BAIXA", materialType: "Banner", formats: ["Banner"], requester: anaCarolina, campaign: campInstitucional, dueInDays: -120, department: "Marketing" },
  ];

  const positionCounters: Record<string, number> = {};
  const createdDemands = [];
  for (const seed of demandSeeds) {
    const position = (positionCounters[seed.status] = (positionCounters[seed.status] ?? -1) + 1);
    const demand = await prisma.demand.create({
      data: {
        code: nextCode(),
        title: seed.title,
        description: seed.description,
        requesterId: seed.requester.id,
        assigneeId: seed.assignee?.id,
        department: seed.department,
        priority: seed.priority,
        dueDate: daysFromNow(seed.dueInDays),
        campaignId: seed.campaign?.id,
        materialType: seed.materialType,
        formats: JSON.stringify(seed.formats),
        region: seed.region,
        status: seed.status,
        position,
      },
    });
    createdDemands.push(demand);
  }

  console.log("Adicionando checklist, comentários e versões...");
  const embalagemDemand = createdDemands.find((d) => d.title.startsWith("Embalagem 400g"))!;
  await prisma.demandChecklistItem.createMany({
    data: [
      { demandId: embalagemDemand.id, label: "Corrigir tom do dourado da logo", done: true, position: 0 },
      { demandId: embalagemDemand.id, label: "Aumentar tabela nutricional", done: false, position: 1 },
      { demandId: embalagemDemand.id, label: "Revisar validade impressa", done: false, position: 2 },
    ],
  });
  const embalagemVersion1 = await prisma.demandVersion.create({
    data: { demandId: embalagemDemand.id, versionNumber: 1, label: "V01", fileUrl: "/images/produtos/pingo-bel.webp", uploadedById: carla.id, isFinal: false },
  });
  await prisma.demandVersion.create({
    data: { demandId: embalagemDemand.id, versionNumber: 2, label: "V02", fileUrl: "/images/produtos/pingo-bel.webp", uploadedById: carla.id, isFinal: false },
  });
  await prisma.demandComment.createMany({
    data: [
      { demandId: embalagemDemand.id, versionId: embalagemVersion1.id, authorId: fernanda.id, text: "Trocar esta foto por uma com o produto mais destacado.", xPercent: 62, yPercent: 40 },
      { demandId: embalagemDemand.id, versionId: embalagemVersion1.id, authorId: fernanda.id, text: "Aumentar a logo em 10%.", xPercent: 18, yPercent: 15 },
      { demandId: embalagemDemand.id, authorId: carla.id, text: "Ajustado, aguardando nova validação.", resolved: false },
    ],
  });
  await prisma.approval.createMany({
    data: [
      { demandId: embalagemDemand.id, versionId: embalagemVersion1.id, approverId: fernanda.id, level: 1, status: "AJUSTES", comment: "Ver comentários na peça.", decidedAt: hoursAgo(4) },
    ],
  });

  const paraAprovacao = createdDemands.filter((d) => d.status === "PARA_APROVACAO");
  for (const demand of paraAprovacao) {
    const version = await prisma.demandVersion.create({
      data: { demandId: demand.id, versionNumber: 1, label: "V01", fileUrl: "/images/produtos/beijo-com-chocolate.webp", uploadedById: carla.id },
    });
    await prisma.approval.create({
      data: { demandId: demand.id, versionId: version.id, approverId: fernanda.id, level: 1, status: "PENDENTE" },
    });
  }

  console.log("Criando eventos de calendário...");
  await prisma.calendarEvent.createMany({
    data: [
      { title: "Dia das Crianças", date: daysFromNow(20), type: "DATA_COMEMORATIVA", color: "#b3392c", campaignId: campMesDoce.id, description: "Campanha nacional para o Dia das Crianças." },
      { title: "Degustação em PDV — Regional Sudeste", date: daysFromNow(23), type: "EVENTO", color: "#3c6e9b" },
      { title: "Mês do Doce Mineiro — conteúdo digital", date: daysFromNow(1), endDate: daysFromNow(30), type: "CAMPANHA", color: "#3f8a4f", campaignId: campMesDoce.id },
      { title: "Treinamento de representantes", date: daysFromNow(30), type: "TREINAMENTO", color: "#6e407d", description: "Treinamento online sobre novos materiais comerciais." },
      { title: "Lançamento — Nova Palha Italiana", date: daysFromNow(-1), type: "LANCAMENTO", color: "#c97b2e", campaignId: campLancamento.id },
      { title: "Black Friday 2026", date: daysFromNow(58), type: "DATA_COMEMORATIVA", color: "#b3392c" },
      { title: "Festa Junina — início da campanha", date: daysFromNow(15), type: "CAMPANHA", color: "#d4a017", campaignId: campJunina.id },
      { title: "Publicação — Story bastidores", date: daysFromNow(-3), type: "PUBLICACAO", color: "#8a6a4f" },
    ],
  });

  console.log("Criando publicados...");
  const publicadas = createdDemands.filter((d) => d.status === "PUBLICADO");
  await prisma.publication.createMany({
    data: [
      { demandId: publicadas[0]?.id, title: "LANÇAMENTO — Nova Palha Italiana", channel: "INSTAGRAM", publishedAt: daysFromNow(-1), fileUrl: "/images/produtos/palha-italiana.webp", campaignId: campLancamento.id, responsibleId: carla.id, reuseCount: 3, engagement: 4820 },
      { demandId: publicadas[1]?.id, title: "Story — bastidores da produção", channel: "INSTAGRAM", publishedAt: daysFromNow(-3), fileUrl: "/images/campanhas/palha-cena.png", campaignId: campInstitucional.id, responsibleId: carla.id, reuseCount: 1, engagement: 2140 },
      { title: "Post Institucional — tradição mineira", channel: "FACEBOOK", publishedAt: daysFromNow(-8), fileUrl: "/images/campanhas/paisagem-minas.png", campaignId: campInstitucional.id, responsibleId: anaCarolina.id, reuseCount: 6, engagement: 3110 },
      { title: "Card comercial — Pingo Bel", channel: "REPRESENTANTES", publishedAt: daysFromNow(-12), fileUrl: "/images/produtos/pingo-bel.webp", campaignId: campMaes.id, responsibleId: marcos.id, reuseCount: 12, engagement: 980 },
      { title: "Banner site — loja oficial", channel: "SITE", publishedAt: daysFromNow(-20), fileUrl: "/images/campanhas/pote-pingo-bel.webp", campaignId: campInstitucional.id, responsibleId: anaCarolina.id, reuseCount: 2, engagement: 1560 },
      { title: "Cartaz PDV — Regional Sul", channel: "PDV", publishedAt: daysFromNow(-25), fileUrl: "/images/produtos/beijo.webp", campaignId: campMaes.id, responsibleId: carla.id, reuseCount: 8, engagement: 640 },
    ],
  });

  console.log("Criando histórico de publicações (para o gráfico de desempenho)...");
  const channels = ["INSTAGRAM", "FACEBOOK", "SITE", "PDV"] as const;
  const historicalCounts = [11, 15, 14, 22, 18, 33]; // tendência de crescimento, mês mais antigo primeiro
  for (let monthsAgo = historicalCounts.length - 1; monthsAgo >= 0; monthsAgo--) {
    const count = historicalCounts[historicalCounts.length - 1 - monthsAgo];
    for (let i = 0; i < count; i++) {
      const publishedAt = new Date();
      publishedAt.setMonth(publishedAt.getMonth() - monthsAgo);
      publishedAt.setDate(1 + Math.floor((i / count) * 26));
      await prisma.publication.create({
        data: {
          title: `Publicação ${channels[i % channels.length].toLowerCase()} #${i + 1}`,
          channel: channels[i % channels.length],
          publishedAt,
          campaignId: [campMaes, campLancamento, campInstitucional][i % 3].id,
          responsibleId: [carla, anaCarolina, marcos][i % 3].id,
          reuseCount: i % 4,
          engagement: 300 + Math.round(Math.random() * 2200),
        },
      });
    }
  }

  console.log("Criando galeria de arquivos...");
  const mediaData = [
    { name: "Doce de Leite Tradicional", category: "PRODUTOS", type: "FOTO", url: "/images/produtos/palha-italiana.webp", sizeBytes: 4_200_000, width: 1536, height: 1024, tags: ["palha italiana", "produto", "tradicional"], campaignId: campInstitucional.id },
    { name: "Embalagem 400g", category: "PRODUTOS", type: "ARTE", url: "/images/produtos/pingo-bel.webp", sizeBytes: 3_100_000, width: 1200, height: 1200, tags: ["embalagem", "pingo bel"], campaignId: campInstitucional.id },
    { name: "Banner Campanha 2026", category: "CAMPANHAS", type: "ARTE", url: "/images/campanhas/palha-cena.png", sizeBytes: 2_800_000, width: 1920, height: 1080, tags: ["banner", "campanha"], campaignId: campLancamento.id },
    { name: "Post Instagram — Beijo com Chocolate", category: "CAMPANHAS", type: "ARTE", url: "/images/produtos/beijo-com-chocolate.webp", sizeBytes: 1_900_000, width: 1080, height: 1350, tags: ["instagram", "beijo com chocolate"], campaignId: campLancamento.id },
    { name: "Evento Expoalimentos", category: "EVENTOS", type: "FOTO", url: "/images/campanhas/pote-pingo-bel.webp", sizeBytes: 5_600_000, width: 2000, height: 1333, tags: ["evento", "expoalimentos"] },
    { name: "Arte Institucional", category: "INSTITUCIONAL", type: "ARTE", url: "/images/campanhas/paisagem-minas.png", sizeBytes: 3_400_000, width: 1920, height: 1080, tags: ["institucional", "minas gerais"] },
    { name: "Caixa Presenteável", category: "PRODUTOS", type: "FOTO", url: "/images/produtos/beijo-de-moca.webp", sizeBytes: 2_700_000, width: 1600, height: 1600, tags: ["embalagem", "presente"] },
    { name: "Linha Completa", category: "PRODUTOS", type: "FOTO", url: "/images/produtos/brigadeiro.webp", sizeBytes: 4_100_000, width: 1800, height: 1200, tags: ["linha completa", "produto"] },
    { name: "Pé de Moça — detalhe", category: "PRODUTOS", type: "FOTO", url: "/images/produtos/pe-de-moca.webp", sizeBytes: 2_300_000, width: 1536, height: 1024, tags: ["pé de moça", "produto"] },
    { name: "Beijo — detalhe", category: "PRODUTOS", type: "FOTO", url: "/images/produtos/beijo.webp", sizeBytes: 2_000_000, width: 1536, height: 1024, tags: ["beijo", "produto"] },
    { name: "Manual do Representante 2026", category: "REPRESENTANTES", type: "EDITAVEL", url: "/images/campanhas/paisagem-minas.png", sizeBytes: 8_900_000, width: null, height: null, tags: ["manual", "representante"] },
    { name: "Fábrica — linha de produção", category: "FABRICA", type: "FOTO", url: "/images/campanhas/pingo-bel-corte.png", sizeBytes: 6_200_000, width: 1920, height: 1280, tags: ["fábrica", "produção"] },
  ] as const;

  for (const [index, media] of mediaData.entries()) {
    await prisma.mediaFile.create({
      data: {
        name: media.name,
        category: media.category,
        type: media.type,
        url: media.url,
        sizeBytes: media.sizeBytes,
        width: media.width ?? null,
        height: media.height ?? null,
        tags: JSON.stringify(media.tags),
        campaignId: "campaignId" in media ? media.campaignId : undefined,
        status: "APROVADO",
        reuseCount: [48, 36, 28, 12, 6][index % 5],
        uploadedById: [carla, anaCarolina, marcos][index % 3].id,
        createdAt: daysFromNow(-index * 3),
      },
    });
  }

  console.log("Criando fornecedores e despesas...");
  const [graficaMinas, fotoEstudio, eventosBH, midiaDigital] = await Promise.all([
    prisma.supplier.create({ data: { name: "Gráfica Minas Print", category: "Gráfica", phone: "(31) 3222-1010", whatsapp: "(31) 99222-1010", email: "contato@minasprint.com.br", city: "Belo Horizonte" } }),
    prisma.supplier.create({ data: { name: "Estúdio Ouro Fotografia", category: "Fotografia", phone: "(31) 3555-4040", email: "contato@estudioouro.com.br", city: "Ouro Preto" } }),
    prisma.supplier.create({ data: { name: "BH Eventos & Estruturas", category: "Eventos", phone: "(31) 3444-2020", city: "Belo Horizonte" } }),
    prisma.supplier.create({ data: { name: "Agência Sabor Digital", category: "Comunicação Visual", phone: "(31) 3777-9090", email: "hello@sabordigital.com.br", city: "Belo Horizonte" } }),
  ]);

  await prisma.expense.createMany({
    data: [
      { description: "Impressão de cartazes PDV", category: "Gráfica", amount: 850, campaignId: campJunina.id, supplierId: graficaMinas.id, status: "PAGO", paymentDate: daysFromNow(-10), costCenter: "Marketing" },
      { description: "Carreta de degustação", category: "Eventos", amount: 1500, campaignId: campMesDoce.id, supplierId: eventosBH.id, status: "PENDENTE", costCenter: "Comercial" },
      { description: "Impulsionamento Instagram/Meta", category: "Mídia paga", amount: 500, campaignId: campLancamento.id, supplierId: midiaDigital.id, status: "PAGO", paymentDate: daysFromNow(-5), costCenter: "Marketing" },
      { description: "Brindes personalizados", category: "Brindes", amount: 2300, campaignId: campMesDoce.id, status: "PENDENTE", costCenter: "Marketing" },
      { description: "Sessão de fotos institucional", category: "Fotografia", amount: 3200, campaignId: campInstitucional.id, supplierId: fotoEstudio.id, status: "PAGO", paymentDate: daysFromNow(-18), costCenter: "Marketing" },
      { description: "Vídeo institucional — fábrica", category: "Vídeo", amount: 4800, campaignId: campInstitucional.id, supplierId: fotoEstudio.id, status: "PENDENTE", costCenter: "Diretoria" },
      { description: "Material impresso — catálogo", category: "Impressos", amount: 1120, campaignId: campInstitucional.id, supplierId: graficaMinas.id, status: "PAGO", paymentDate: daysFromNow(-2), costCenter: "Marketing" },
      { description: "Wobblers e displays PDV", category: "Materiais PDV", amount: 690, campaignId: campMaes.id, supplierId: graficaMinas.id, status: "PAGO", paymentDate: daysFromNow(-30), costCenter: "Comercial" },
    ],
  });

  await prisma.budget.createMany({
    data: [
      { month: new Date().getMonth() + 1, year: new Date().getFullYear(), plannedAmount: 26800 },
      { month: new Date().getMonth(), year: new Date().getFullYear(), plannedAmount: 24000 },
    ],
  });

  console.log("Criando representantes...");
  await prisma.representative.createMany({
    data: [
      { userId: bruno.id, name: "Bruno Almeida", email: bruno.email, phone: "(31) 98888-1234", region: "Regional Sul", status: "ATIVO" },
      { userId: juliana.id, name: "Juliana Costa", email: juliana.email, phone: "(31) 98888-5678", region: "Regional Sudeste", status: "INATIVO" },
      { name: "José Alves", email: "jose.alves@representantes.com.br", phone: "(31) 98888-9012", region: "Regional Sul", status: "ATIVO" },
    ],
  });

  console.log("Registrando atividades recentes...");
  await prisma.activityLog.createMany({
    data: [
      { userId: fernanda.id, action: "DEMANDA_CRIADA", entityType: "Demand", description: "Nova demanda criada — Campanha Dia das Mães – Regional SP", createdAt: hoursAgo(2) },
      { userId: fernanda.id, action: "APROVACAO_CONCLUIDA", entityType: "Demand", description: "Aprovação concluída — Artes para ponto de venda", createdAt: hoursAgo(4) },
      { userId: carla.id, action: "ARQUIVO_ADICIONADO", entityType: "MediaFile", description: "Arquivo adicionado no Drive — Manual do Representante 2026", createdAt: hoursAgo(24) },
      { userId: carla.id, action: "CAMPANHA_PUBLICADA", entityType: "Publication", description: "Campanha publicada — LANÇAMENTO Nova Palha Italiana", createdAt: hoursAgo(26) },
      { userId: gustavo.id, action: "REPRESENTANTE_CADASTRADO", entityType: "Representative", description: "Novo representante cadastrado — José Alves, Regional Sul", createdAt: hoursAgo(48) },
      { userId: diego.id, action: "DESPESA_PAGA", entityType: "Expense", description: "Despesa marcada como paga — Sessão de fotos institucional", createdAt: hoursAgo(50) },
    ],
  });

  console.log("Criando notificações para Ana Carolina...");
  await prisma.notification.createMany({
    data: [
      { userId: anaCarolina.id, title: "Aprovação pendente", body: "Post Instagram — Beijo com Chocolate aguarda sua aprovação.", type: "APROVACAO", link: "/demandas", createdAt: hoursAgo(2) },
      { userId: anaCarolina.id, title: "Prazo vence amanhã", body: "Artes para ponto de venda vencem amanhã.", type: "PRAZO", link: "/demandas", createdAt: hoursAgo(6) },
      { userId: anaCarolina.id, title: "Campanha publicada", body: "LANÇAMENTO — Nova Palha Italiana foi publicada no Instagram.", type: "PUBLICACAO", link: "/publicados", createdAt: hoursAgo(26), read: true },
    ],
  });

  console.log("Seed concluído. Login de demonstração:");
  console.log("  E-mail: ana.carolina@ourominas.com.br");
  console.log(`  Senha:  ${DEMO_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
