import { NextRequest, NextResponse } from "next/server";

const channels = [
  {
    id: 1,
    name: "Global Radio",
    type: "QChannel",
    description: "QMOI Global Channel",
    dj: "QMOI",
    programs: [
      { time: "08:00", title: "Morning Mix", presenter: "QMOI", type: "music" },
      { time: "12:00", title: "Global News", presenter: "QMOI", type: "news" },
      {
        time: "18:00",
        title: "Evening Urban",
        presenter: "QMOI",
        type: "music",
      },
    ],
  },
  {
    id: 2,
    name: "Urban Radio",
    type: "QChannel",
    description: "QMOI Urban Channel",
    dj: "QMOI",
    programs: [
      { time: "09:00", title: "Urban Beats", presenter: "QMOI", type: "music" },
      { time: "15:00", title: "Urban News", presenter: "QMOI", type: "news" },
      { time: "20:00", title: "Night Party", presenter: "QMOI", type: "music" },
    ],
  },
];
let currentChannel = channels[0];
let nowPlaying = {
  channel: currentChannel.name,
  program: currentChannel.programs[0],
  startedAt: new Date().toISOString(),
};
const listeners = 3;

function isMaster(req: NextRequest) {
  return req.headers.get("x-qmoi-master") === "true";
}

export async function GET_CHANNELS(req: NextRequest) {
  return NextResponse.json({ channels });
}

export async function GET_PROGRAMS(req: NextRequest) {
  return NextResponse.json({
    programs: channels.map((c) => ({ channel: c.name, programs: c.programs })),
  });
}

export async function POST_PLAY(req: NextRequest) {
  const body = await req.json();
  const { channelId } = body;
  const channel = channels.find((c) => c.id === channelId);
  if (!channel)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  currentChannel = channel;
  nowPlaying = {
    channel: channel.name,
    program: channel.programs[0],
    startedAt: new Date().toISOString(),
  };
  return NextResponse.json({ success: true, nowPlaying });
}

export async function GET_STATUS(req: NextRequest) {
  return NextResponse.json({ nowPlaying, listeners });
}

export async function POST_PROGRAM(req: NextRequest) {
  if (!isMaster(req))
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const { channelId, program } = body;
  const idx = channels.findIndex((c) => c.id === channelId);
  if (idx === -1)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  channels[idx].programs.push(program);
  return NextResponse.json({ success: true, programs: channels[idx].programs });
}

export async function GET_LISTENERS(req: NextRequest) {
  return NextResponse.json({ listeners });
}
// TODO: FM/AM integration, automation, QMOI as DJ/presenter, auto-programming
