import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const cfg = await prisma.siteConfig.findUnique({ where: { id: 'config_main' } });
  return NextResponse.json(cfg);
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const landingDraft = body.landingDraft ?? null;
    const publish = !!body.publish;

    const updateData: any = {};
    if (landingDraft !== undefined) updateData.landingDraft = landingDraft;
    if (publish) {
      updateData.landingBlocks = landingDraft;
      updateData.landingPublished = true;
    }

    const upsert = await prisma.siteConfig.upsert({
      where: { id: 'config_main' },
      update: updateData,
      create: {
        id: 'config_main',
        landingBlocks: publish ? landingDraft : null,
        landingDraft: landingDraft ?? null,
        landingPublished: publish ? true : (body.landingPublished ?? true),
      }
    });

    return NextResponse.json(upsert);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 400 });
  }
}
