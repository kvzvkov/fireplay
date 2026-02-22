import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MAPS = [
  { id: "dust2", name: "Dust II", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/De_dust2_csgo.jpg/320px-De_dust2_csgo.jpg" },
  { id: "mirage", name: "Mirage", img: "https://static.wikia.nocookie.net/cswikia/images/5/5e/Cs2_de_mirage.jpg/revision/latest/scale-to-width-down/320?cb=20230929124539" },
  { id: "inferno", name: "Inferno", img: "https://static.wikia.nocookie.net/cswikia/images/4/48/De_inferno_cs2.jpg/revision/latest/scale-to-width-down/320?cb=20230929124541" },
  { id: "nuke", name: "Nuke", img: "https://static.wikia.nocookie.net/cswikia/images/2/20/De_nuke_cs2.jpg/revision/latest/scale-to-width-down/320?cb=20231020190053" },
  { id: "ancient", name: "Ancient", img: "https://static.wikia.nocookie.net/cswikia/images/f/f3/De_ancient_cs2.jpg/revision/latest/scale-to-width-down/320?cb=20231020190052" },
  { id: "vertigo", name: "Vertigo", img: "https://static.wikia.nocookie.net/cswikia/images/e/eb/De_vertigo_cs2.jpg/revision/latest/scale-to-width-down/320?cb=20231020190055" },
  { id: "anubis", name: "Anubis", img: "https://static.wikia.nocookie.net/cswikia/images/9/9a/De_anubis_cs2.jpg/revision/latest/scale-to-width-down/320?cb=20231020190050" },
];

const ROOMS_DATA = [
  { id: 1, name: "Pro Match #1", creator: "xXFlameXx", bet: 200, players: 8, maxPlayers: 10, map: "Mirage", status: "waiting", minLevel: 3 },
  { id: 2, name: "Casual 5v5", creator: "SniperKing", bet: 50, players: 6, maxPlayers: 10, map: "Dust II", status: "waiting", minLevel: 1 },
  { id: 3, name: "High Roller", creator: "TopFragger", bet: 500, players: 10, maxPlayers: 10, map: "Inferno", status: "playing", minLevel: 5 },
  { id: 4, name: "Night Shift", creator: "GhostAim", bet: 100, players: 4, maxPlayers: 10, map: "Nuke", status: "waiting", minLevel: 2 },
];

const MATCH_HISTORY = [
  { id: 1, map: "Mirage", result: "WIN", score: "16-12", kd: "24/14", rating: 1.42, date: "Сегодня", prize: "+450 SP" },
  { id: 2, map: "Dust II", result: "LOSS", score: "10-16", kd: "18/21", rating: 0.88, date: "Вчера", prize: "-200 SP" },
  { id: 3, map: "Inferno", result: "WIN", score: "16-8", kd: "29/11", rating: 1.87, date: "2 дня назад", prize: "+320 SP" },
  { id: 4, map: "Nuke", result: "WIN", score: "16-14", kd: "21/17", rating: 1.15, date: "3 дня назад", prize: "+180 SP" },
  { id: 5, map: "Ancient", result: "LOSS", score: "13-16", kd: "15/19", rating: 0.79, date: "4 дня назад", prize: "-150 SP" },
];

const TOURNAMENT_DATA = {
  rounds: [
    {
      name: "1/4 Финала",
      matches: [
        { team1: "FlameSquad", team2: "IceBreakers", score1: 16, score2: 11, winner: 0 },
        { team1: "DustBusters", team2: "NukeForce", score1: 8, score2: 16, winner: 1 },
        { team1: "HeadshotHeroes", team2: "RushB", score1: 16, score2: 14, winner: 0 },
        { team1: "SmokeMasters", team2: "FlashBangers", score1: 12, score2: 16, winner: 1 },
      ],
    },
    {
      name: "1/2 Финала",
      matches: [
        { team1: "FlameSquad", team2: "NukeForce", score1: 16, score2: 9, winner: 0 },
        { team1: "HeadshotHeroes", team2: "FlashBangers", score1: null, score2: null, winner: null },
      ],
    },
    {
      name: "Финал",
      matches: [
        { team1: "FlameSquad", team2: "???", score1: null, score2: null, winner: null },
      ],
    },
  ],
};

const TROPHIES = [
  { id: 1, name: "Чемпион лиги", icon: "🏆", date: "Янв 2025", color: "#FFD700" },
  { id: 2, name: "MVP турнира", icon: "⭐", date: "Дек 2024", color: "#FF6B35" },
  { id: 3, name: "100 побед", icon: "💎", date: "Ноя 2024", color: "#00D4FF" },
];

const LEVELS = [
  { level: 1, minXP: 0, maxXP: 500, name: "Новичок", maxBet: 100, color: "#9E9E9E" },
  { level: 2, minXP: 500, maxXP: 1500, name: "Боец", maxBet: 250, color: "#4CAF50" },
  { level: 3, minXP: 1500, maxXP: 3000, name: "Ветеран", maxBet: 500, color: "#2196F3" },
  { level: 4, minXP: 3000, maxXP: 6000, name: "Элита", maxBet: 1000, color: "#9C27B0" },
  { level: 5, minXP: 6000, maxXP: 10000, name: "Мастер", maxBet: 5000, color: "#FF9800" },
  { level: 6, minXP: 10000, maxXP: 999999, name: "Легенда", maxBet: 99999, color: "#FF4500" },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Exo+2:wght@300;400;600;700;800&family=Share+Tech+Mono&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg-deep: #060810;
    --bg-dark: #0C0F1A;
    --bg-card: #111525;
    --bg-card2: #161B2E;
    --border: rgba(255,69,0,0.15);
    --border-bright: rgba(255,69,0,0.4);
    --fire: #FF4500;
    --fire2: #FF6B35;
    --gold: #FFD700;
    --cyan: #00D4FF;
    --text: #E8EAF0;
    --text-dim: #6B7280;
    --text-muted: #374151;
    --win: #22C55E;
    --loss: #EF4444;
    --gradient-fire: linear-gradient(135deg, #FF4500, #FF8C00);
    --gradient-dark: linear-gradient(180deg, #0C0F1A 0%, #060810 100%);
  }

  html, body { height: 100%; }
  body {
    font-family: 'Exo 2', sans-serif;
    background: var(--bg-deep);
    color: var(--text);
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg-dark); }
  ::-webkit-scrollbar-thumb { background: var(--fire); border-radius: 2px; }

  .app-container {
    display: flex;
    min-height: 100vh;
    position: relative;
  }

  /* Background grid effect */
  .app-container::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: 
      linear-gradient(rgba(255,69,0,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,69,0,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
  }

  /* ─── SIDEBAR ─── */
  .sidebar {
    width: 240px;
    min-height: 100vh;
    background: linear-gradient(180deg, #0E1222 0%, #080B14 100%);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 0; top: 0; bottom: 0;
    z-index: 100;
    padding: 0 0 20px;
  }

  .logo-area {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 40px; height: 40px;
    background: var(--gradient-fire);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 0 20px rgba(255,69,0,0.4);
    flex-shrink: 0;
  }

  .logo-text {
    font-family: 'Rajdhani', sans-serif;
    font-size: 24px;
    font-weight: 700;
    background: var(--gradient-fire);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .logo-sub { font-size: 9px; color: var(--text-dim); letter-spacing: 3px; text-transform: uppercase; }

  .nav-section { padding: 16px 12px 8px; }
  .nav-label { font-size: 10px; color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; padding: 0 8px 8px; font-family: 'Share Tech Mono', monospace; }

  .nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 2px;
    border: 1px solid transparent;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-dim);
  }

  .nav-item:hover { background: rgba(255,69,0,0.08); color: var(--text); border-color: var(--border); }
  .nav-item.active {
    background: rgba(255,69,0,0.12);
    color: var(--fire);
    border-color: var(--border-bright);
    box-shadow: inset 3px 0 0 var(--fire);
  }

  .nav-icon { width: 20px; text-align: center; font-size: 16px; }

  .sidebar-sp {
    margin: auto 16px 0;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
  }

  .sp-label { font-size: 10px; color: var(--text-dim); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 6px; }
  .sp-amount { font-family: 'Share Tech Mono', monospace; font-size: 22px; color: var(--gold); font-weight: 700; }
  .sp-unit { font-size: 12px; color: var(--text-dim); }

  .topup-btn {
    width: 100%; margin-top: 10px;
    padding: 8px;
    background: var(--gradient-fire);
    border: none; border-radius: 6px;
    color: white; font-family: 'Exo 2', sans-serif;
    font-weight: 700; font-size: 12px;
    letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
  }
  .topup-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .topup-btn:active { transform: translateY(0); }

  /* ─── MAIN ─── */
  .main-content {
    margin-left: 240px;
    flex: 1;
    min-height: 100vh;
    position: relative;
    z-index: 1;
  }

  .top-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 32px;
    border-bottom: 1px solid var(--border);
    background: rgba(6,8,16,0.8);
    backdrop-filter: blur(10px);
    position: sticky; top: 0; z-index: 50;
  }

  .page-title { font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }

  .user-chip {
    display: flex; align-items: center; gap: 10px;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 50px;
    padding: 6px 14px 6px 6px;
    cursor: pointer;
    transition: border-color 0.2s;
  }
  .user-chip:hover { border-color: var(--border-bright); }

  .avatar {
    width: 32px; height: 32px;
    border-radius: 50%;
    background: var(--gradient-fire);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
    flex-shrink: 0;
  }

  .user-name { font-weight: 600; font-size: 14px; }
  .user-level { font-size: 11px; color: var(--fire); font-family: 'Share Tech Mono', monospace; }

  .page-body { padding: 32px; }

  /* ─── CARDS ─── */
  .card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gradient-fire);
    opacity: 0.5;
  }

  .card-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 1px;
    color: var(--text);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }

  /* ─── GRID LAYOUTS ─── */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

  /* ─── STAT CARDS ─── */
  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    position: relative;
    overflow: hidden;
  }
  .stat-card .s-val { font-family: 'Share Tech Mono', monospace; font-size: 32px; font-weight: 700; color: var(--fire); }
  .stat-card .s-label { font-size: 12px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
  .stat-card .s-change { font-size: 12px; color: var(--win); margin-top: 8px; }

  /* ─── PROFILE PAGE ─── */
  .profile-hero {
    background: linear-gradient(135deg, #0E1327 0%, #130A20 100%);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    display: flex; align-items: center; gap: 32px;
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
  }
  .profile-hero::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, rgba(255,69,0,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .profile-avatar {
    width: 90px; height: 90px;
    border-radius: 16px;
    background: var(--gradient-fire);
    display: flex; align-items: center; justify-content: center;
    font-size: 38px; font-weight: 700;
    box-shadow: 0 0 30px rgba(255,69,0,0.3);
    flex-shrink: 0;
    position: relative;
  }
  .profile-avatar .lvl-badge {
    position: absolute; bottom: -8px; right: -8px;
    background: var(--bg-dark); border: 2px solid var(--fire);
    border-radius: 50%;
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: var(--fire);
    font-family: 'Share Tech Mono', monospace;
  }

  .profile-info h1 { font-family: 'Rajdhani', sans-serif; font-size: 28px; font-weight: 700; letter-spacing: 1px; }
  .profile-info .sub { color: var(--text-dim); font-size: 13px; margin-top: 4px; }

  .xp-bar { margin-top: 14px; }
  .xp-bar-bg { background: var(--bg-dark); border-radius: 4px; height: 6px; overflow: hidden; width: 300px; }
  .xp-bar-fill { height: 100%; background: var(--gradient-fire); border-radius: 4px; transition: width 1s ease; }
  .xp-text { font-size: 11px; color: var(--text-dim); margin-top: 4px; font-family: 'Share Tech Mono', monospace; }

  .profile-stats { display: flex; gap: 24px; margin-left: auto; }
  .pstat { text-align: center; }
  .pstat .val { font-family: 'Share Tech Mono', monospace; font-size: 24px; font-weight: 700; color: var(--fire); }
  .pstat .lbl { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }

  /* ─── ROOMS ─── */
  .room-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 18px;
    transition: border-color 0.2s, transform 0.2s;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .room-card:hover { border-color: var(--border-bright); transform: translateY(-2px); }
  .room-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: var(--gradient-fire);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .room-card:hover::after { opacity: 1; }

  .room-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .room-name { font-family: 'Rajdhani', sans-serif; font-size: 17px; font-weight: 700; letter-spacing: 0.5px; }
  .room-status { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 3px 8px; border-radius: 4px; font-family: 'Share Tech Mono', monospace; }
  .status-waiting { background: rgba(255,69,0,0.15); color: var(--fire); border: 1px solid rgba(255,69,0,0.3); }
  .status-playing { background: rgba(34,197,94,0.15); color: var(--win); border: 1px solid rgba(34,197,94,0.3); }

  .room-meta { display: flex; gap: 16px; font-size: 12px; color: var(--text-dim); margin-bottom: 12px; }
  .room-meta span { display: flex; align-items: center; gap: 4px; }

  .room-bet { 
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px;
    background: var(--bg-card2);
    border-radius: 8px;
    border: 1px solid var(--border);
  }
  .bet-amount { font-family: 'Share Tech Mono', monospace; font-size: 18px; color: var(--gold); font-weight: 700; }
  .bet-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }

  .join-btn {
    width: 100%; margin-top: 12px;
    padding: 10px;
    background: transparent;
    border: 1px solid var(--fire);
    border-radius: 8px;
    color: var(--fire);
    font-family: 'Exo 2', sans-serif;
    font-weight: 700; font-size: 13px;
    letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
  }
  .join-btn:hover { background: rgba(255,69,0,0.12); }
  .join-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ─── PLAYERS BAR ─── */
  .players-bar { margin: 10px 0 0; }
  .players-bar-bg { background: var(--bg-dark); border-radius: 4px; height: 4px; overflow: hidden; }
  .players-bar-fill { height: 100%; background: var(--gradient-fire); border-radius: 4px; transition: width 0.3s; }
  .players-text { font-size: 11px; color: var(--text-dim); margin-top: 4px; font-family: 'Share Tech Mono', monospace; }

  /* ─── MATCH HISTORY ─── */
  .match-row {
    display: grid;
    grid-template-columns: 80px 1fr 70px 70px 70px 70px 80px;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 4px;
    transition: background 0.2s;
    font-size: 14px;
    border: 1px solid transparent;
  }
  .match-row:hover { background: var(--bg-card2); border-color: var(--border); }
  .match-row.win { border-left: 3px solid var(--win); }
  .match-row.loss { border-left: 3px solid var(--loss); }

  .result-badge { font-family: 'Share Tech Mono', monospace; font-size: 12px; font-weight: 700; padding: 3px 8px; border-radius: 4px; text-align: center; }
  .result-win { background: rgba(34,197,94,0.15); color: var(--win); }
  .result-loss { background: rgba(239,68,68,0.15); color: var(--loss); }

  .match-header { display: grid; grid-template-columns: 80px 1fr 70px 70px 70px 70px 80px; gap: 12px; padding: 8px 16px; font-size: 10px; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; font-family: 'Share Tech Mono', monospace; }

  /* ─── ANALYTICS ─── */
  .chart-placeholder {
    background: var(--bg-card2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    height: 200px;
    display: flex; align-items: flex-end; gap: 6px;
    overflow: hidden;
  }

  .bar { flex: 1; border-radius: 4px 4px 0 0; background: var(--gradient-fire); opacity: 0.7; transition: opacity 0.2s; cursor: pointer; min-width: 20px; position: relative; }
  .bar:hover { opacity: 1; }

  .heat-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; }
  .heat-cell { aspect-ratio: 1; border-radius: 3px; cursor: pointer; transition: transform 0.1s; }
  .heat-cell:hover { transform: scale(1.3); }

  /* ─── MAP PICK BAN ─── */
  .pickban-container {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
  }

  .pickban-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  .team-section { text-align: center; }
  .team-label { font-family: 'Rajdhani', sans-serif; font-size: 18px; font-weight: 700; }
  .team-action { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }

  .maps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
  
  .map-card {
    position: relative; border-radius: 10px; overflow: hidden;
    aspect-ratio: 16/9;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s, transform 0.2s;
  }
  .map-card:hover:not(.disabled) { border-color: var(--fire); transform: scale(1.03); }
  .map-card img { width: 100%; height: 100%; object-fit: cover; }
  .map-card .map-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%);
    display: flex; align-items: flex-end; padding: 8px;
  }
  .map-card .map-name { font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700; color: white; }
  .map-card.banned { filter: grayscale(100%); opacity: 0.4; cursor: not-allowed; }
  .map-card.picked { border-color: var(--win); }
  .map-card.picked::after { content: '✓'; position: absolute; top: 8px; right: 8px; background: var(--win); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .map-card.banned::after { content: '✕'; position: absolute; top: 8px; right: 8px; background: var(--loss); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .map-card.disabled { cursor: not-allowed; opacity: 0.6; }

  .action-label { text-align: center; padding: 12px; background: rgba(255,69,0,0.1); border: 1px solid var(--border-bright); border-radius: 8px; }
  .action-text { font-family: 'Share Tech Mono', monospace; font-size: 14px; color: var(--fire); }

  /* ─── TOURNAMENTS ─── */
  .bracket {
    display: flex; gap: 0;
    overflow-x: auto;
    padding-bottom: 16px;
  }

  .bracket-round { display: flex; flex-direction: column; justify-content: space-around; min-width: 200px; padding: 0 16px; position: relative; }
  .bracket-round-title { text-align: center; font-size: 11px; color: var(--text-dim); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; font-family: 'Share Tech Mono', monospace; }

  .bracket-match {
    background: var(--bg-card2);
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 16px;
    position: relative;
  }

  .bracket-team {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 12px;
    font-size: 13px; font-weight: 600;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
  }
  .bracket-team:last-child { border-bottom: none; }
  .bracket-team.winner { background: rgba(255,69,0,0.1); color: var(--fire); }
  .bracket-team.tbd { color: var(--text-muted); font-style: italic; }
  .bracket-score { font-family: 'Share Tech Mono', monospace; font-size: 14px; font-weight: 700; }
  .bracket-score.win { color: var(--fire); }

  /* ─── MODAL ─── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(4px);
    z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }

  .modal {
    background: var(--bg-card);
    border: 1px solid var(--border-bright);
    border-radius: 16px;
    padding: 28px;
    width: 100%; max-width: 480px;
    position: relative;
    box-shadow: 0 0 60px rgba(255,69,0,0.15);
  }

  .modal-title { font-family: 'Rajdhani', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 20px; }
  .modal-close { position: absolute; top: 16px; right: 16px; background: none; border: none; color: var(--text-dim); cursor: pointer; font-size: 20px; line-height: 1; }
  .modal-close:hover { color: var(--text); }

  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; display: block; font-family: 'Share Tech Mono', monospace; }
  .form-input {
    width: 100%; padding: 10px 14px;
    background: var(--bg-dark);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Exo 2', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus { border-color: var(--fire); }

  .primary-btn {
    width: 100%; padding: 12px;
    background: var(--gradient-fire);
    border: none; border-radius: 8px;
    color: white; font-family: 'Exo 2', sans-serif;
    font-weight: 700; font-size: 15px;
    letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.1s;
    box-shadow: 0 4px 20px rgba(255,69,0,0.3);
  }
  .primary-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .primary-btn:active { transform: translateY(0); }

  .secondary-btn {
    padding: 10px 20px;
    background: transparent;
    border: 1px solid var(--border-bright);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Exo 2', sans-serif;
    font-weight: 600; font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .secondary-btn:hover { background: rgba(255,69,0,0.1); border-color: var(--fire); color: var(--fire); }

  /* ─── LANDING ─── */
  .landing {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 40px;
    position: relative;
    background: var(--bg-deep);
    overflow: hidden;
  }
  .landing::before {
    content: '';
    position: absolute;
    top: -200px; left: 50%;
    transform: translateX(-50%);
    width: 800px; height: 600px;
    background: radial-gradient(ellipse, rgba(255,69,0,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
  .landing-grid {
    position: absolute; inset: 0;
    background-image: 
      linear-gradient(rgba(255,69,0,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,69,0,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
  }

  .landing-logo { font-family: 'Rajdhani', sans-serif; font-size: 72px; font-weight: 700; background: var(--gradient-fire); -webkit-background-clip: text; -webkit-text-fill-color: transparent; letter-spacing: 6px; text-transform: uppercase; text-align: center; line-height: 1; }
  .landing-sub { font-size: 14px; color: var(--text-dim); letter-spacing: 4px; text-transform: uppercase; text-align: center; margin-top: 8px; margin-bottom: 48px; }

  .landing-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; max-width: 700px; width: 100%; margin-bottom: 48px; }
  .feat-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    transition: border-color 0.2s, transform 0.2s;
  }
  .feat-card:hover { border-color: var(--border-bright); transform: translateY(-3px); }
  .feat-icon { font-size: 28px; margin-bottom: 10px; }
  .feat-title { font-family: 'Rajdhani', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px; }
  .feat-desc { font-size: 12px; color: var(--text-dim); line-height: 1.5; }

  .steam-btn {
    display: flex; align-items: center; gap: 14px;
    padding: 16px 40px;
    background: linear-gradient(135deg, #1b2838, #2a475e);
    border: 1px solid #4a90d9;
    border-radius: 12px;
    color: white; font-family: 'Exo 2', sans-serif;
    font-weight: 700; font-size: 16px;
    letter-spacing: 1px; text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 0 30px rgba(74,144,217,0.2);
  }
  .steam-btn:hover { transform: translateY(-3px); box-shadow: 0 8px 40px rgba(74,144,217,0.4); border-color: #74b9ff; }
  .steam-icon { font-size: 28px; }

  .bonus-notice {
    margin-top: 20px;
    padding: 12px 24px;
    background: rgba(255,215,0,0.08);
    border: 1px solid rgba(255,215,0,0.2);
    border-radius: 8px;
    font-size: 13px;
    color: var(--gold);
    text-align: center;
  }

  /* ─── TROPHY ─── */
  .trophy-card {
    background: var(--bg-card2);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    transition: transform 0.2s, border-color 0.2s;
  }
  .trophy-card:hover { transform: translateY(-3px); border-color: var(--border-bright); }
  .trophy-icon { font-size: 36px; margin-bottom: 8px; }
  .trophy-name { font-size: 12px; font-weight: 600; letter-spacing: 0.5px; }
  .trophy-date { font-size: 10px; color: var(--text-dim); margin-top: 4px; font-family: 'Share Tech Mono', monospace; }

  /* ─── TABS ─── */
  .tabs { display: flex; gap: 4px; margin-bottom: 20px; background: var(--bg-card); border: 1px solid var(--border); padding: 4px; border-radius: 10px; width: fit-content; }
  .tab { padding: 8px 20px; border-radius: 7px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; font-family: 'Rajdhani', sans-serif; font-size: 14px; }
  .tab:hover { color: var(--text); }
  .tab.active { background: var(--gradient-fire); color: white; box-shadow: 0 0 15px rgba(255,69,0,0.3); }

  /* ─── LOBBY MODAL ─── */
  .lobby-teams { display: grid; grid-template-columns: 1fr auto 1fr; gap: 16px; align-items: start; margin: 16px 0; }
  .team-box { background: var(--bg-card2); border: 1px solid var(--border); border-radius: 10px; padding: 14px; }
  .team-box-title { font-family: 'Rajdhani', sans-serif; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
  .player-slot { display: flex; align-items: center; gap: 8px; padding: 6px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
  .player-slot:last-child { border-bottom: none; }
  .player-dot { width: 8px; height: 8px; border-radius: 50%; }
  .vs-badge { display: flex; align-items: center; justify-content: center; font-family: 'Rajdhani', sans-serif; font-size: 24px; font-weight: 700; color: var(--fire); }
  .pot-display { text-align: center; padding: 12px; background: rgba(255,215,0,0.08); border: 1px solid rgba(255,215,0,0.2); border-radius: 8px; margin: 12px 0; }
  .pot-val { font-family: 'Share Tech Mono', monospace; font-size: 24px; color: var(--gold); font-weight: 700; }
  .pot-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }

  /* ─── TOPUP ─── */
  .amount-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 12px 0; }
  .amount-btn { padding: 12px; background: var(--bg-dark); border: 1px solid var(--border); border-radius: 8px; color: var(--text); font-family: 'Share Tech Mono', monospace; font-size: 15px; font-weight: 700; cursor: pointer; transition: all 0.2s; text-align: center; }
  .amount-btn:hover, .amount-btn.selected { border-color: var(--fire); background: rgba(255,69,0,0.1); color: var(--fire); }
  .amount-sub { font-size: 10px; color: var(--text-dim); display: block; margin-top: 2px; font-family: 'Exo 2', sans-serif; }

  /* ─── NOTIFICATION ─── */
  .notif {
    position: fixed; top: 80px; right: 20px;
    background: var(--bg-card);
    border: 1px solid var(--border-bright);
    border-left: 3px solid var(--fire);
    border-radius: 10px;
    padding: 14px 18px;
    z-index: 9999;
    min-width: 260px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    animation: slideIn 0.3s ease;
  }
  .notif-title { font-family: 'Rajdhani', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.5px; }
  .notif-body { font-size: 12px; color: var(--text-dim); margin-top: 4px; }
  @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

  /* ─── LEVEL REQUIREMENT ─── */
  .level-chip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-family: 'Share Tech Mono', monospace; }

  /* ─── CREATE ROOM ─── */
  .level-info { background: var(--bg-dark); border: 1px solid var(--border); border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 13px; color: var(--text-dim); }
  .level-row { display: flex; justify-content: space-between; align-items: center; }
  .level-highlight { color: var(--fire); font-family: 'Share Tech Mono', monospace; font-weight: 700; }

  /* ─── MINI SPARKLINE ─── */
  .sparkline { display: flex; align-items: flex-end; gap: 2px; height: 40px; }
  .spark-bar { width: 6px; border-radius: 2px 2px 0 0; background: var(--fire); opacity: 0.7; }

  /* misc */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .mb-20 { margin-bottom: 20px; }
  .mb-12 { margin-bottom: 12px; }
  .flex { display: flex; }
  .flex-between { display: flex; justify-content: space-between; align-items: center; }
  .gap-12 { gap: 12px; }
  .text-fire { color: var(--fire); }
  .text-gold { color: var(--gold); }
  .text-dim { color: var(--text-dim); }
  .text-win { color: var(--win); }
  .text-loss { color: var(--loss); }
  .mono { font-family: 'Share Tech Mono', monospace; }
  .rajdhani { font-family: 'Rajdhani', sans-serif; }
  .small { font-size: 12px; }
  .tag { padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; }
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function SteamIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 10C27.9 10 10 27.9 10 50c0 18.8 12.7 34.6 30 39.4l4.5-10.8c-1-.3-2-.7-3-1.2L30 83.1C19.2 76.5 12 64.1 12 50c0-20.9 17.1-38 38-38s38 17.1 38 38c0 14.1-7.7 26.4-19.1 33L75 92.7C86.3 85.2 94 71.5 94 56c0-24.3-19.7-44-44-44z"/>
      <circle cx="50" cy="50" r="20"/>
    </svg>
  );
}

function Notification({ notif, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);
  if (!notif) return null;
  return (
    <div className="notif">
      <div className="notif-title">{notif.title}</div>
      <div className="notif-body">{notif.body}</div>
    </div>
  );
}

function MiniBar({ values, color = "#FF4500" }) {
  const max = Math.max(...values);
  return (
    <div className="sparkline">
      {values.map((v, i) => (
        <div key={i} className="spark-bar" style={{ height: `${(v / max) * 100}%`, background: color }} />
      ))}
    </div>
  );
}

function XPBar({ xp, level }) {
  const lvlData = LEVELS[level - 1] || LEVELS[0];
  const pct = Math.min(100, ((xp - lvlData.minXP) / (lvlData.maxXP - lvlData.minXP)) * 100);
  return (
    <div className="xp-bar">
      <div className="xp-bar-bg"><div className="xp-bar-fill" style={{ width: `${pct}%` }} /></div>
      <div className="xp-text">{xp.toLocaleString()} / {lvlData.maxXP.toLocaleString()} XP — {lvlData.name}</div>
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function HomePage({ user, setUser, showNotif, setPage }) {
  const recentMatches = MATCH_HISTORY.slice(0, 3);
  const winRate = Math.round((user.wins / (user.wins + user.losses)) * 100);
  const kd = (user.kills / user.deaths).toFixed(2);

  return (
    <div>
      {/* Welcome banner */}
      <div style={{ background: "linear-gradient(135deg, #0E1327, #130A20)", border: "1px solid rgba(255,69,0,0.2)", borderRadius: 16, padding: "28px 32px", marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 250, height: 250, background: "radial-gradient(circle, rgba(255,69,0,0.12) 0%, transparent 70%)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, color: "var(--text-dim)", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>Добро пожаловать</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 32, fontWeight: 700 }}>Привет, <span className="text-fire">{user.name}</span></div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginTop: 6 }}>Уровень {user.level} · {LEVELS[user.level - 1]?.name} · {user.sp.toLocaleString()} SP</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="secondary-btn" onClick={() => setPage("rooms")}>🎯 Найти матч</button>
            <button className="primary-btn" style={{ width: "auto", padding: "10px 24px" }} onClick={() => setPage("rooms")}>+ Создать лобби</button>
          </div>
        </div>
        {user.welcomeBonus && (
          <div style={{ marginTop: 16, padding: "10px 16px", background: "rgba(255,215,0,0.08)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 8, fontSize: 13, color: "var(--gold)", display: "flex", alignItems: "center", gap: 8 }}>
            🎁 <strong>Приветственный бонус получен!</strong>&nbsp;+100 SP зачислены на ваш счёт
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid-4 mb-20">
        {[
          { val: `${winRate}%`, label: "Процент побед", icon: "🏆", change: "+3.2% за неделю" },
          { val: kd, label: "K/D Ratio", icon: "🎯", change: "+0.12 за месяц" },
          { val: user.sp.toLocaleString(), label: "Strike Points", icon: "💎", change: "Баланс" },
          { val: user.matches, label: "Всего матчей", icon: "⚡", change: `${user.wins} побед` },
        ].map((s, i) => (
          <div className="stat-card" key={i} style={{ cursor: "default" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
            <div className="s-val">{s.val}</div>
            <div className="s-label">{s.label}</div>
            <div className="s-change">{s.change}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-20">
        {/* Recent matches */}
        <div className="card">
          <div className="card-title">⚡ Последние матчи</div>
          <div className="match-header" style={{ gridTemplateColumns: "70px 1fr 70px 70px 80px" }}>
            <span>Результат</span><span>Карта</span><span>Счёт</span><span>K/D</span><span>SP</span>
          </div>
          {recentMatches.map(m => (
            <div key={m.id} className={`match-row ${m.result === "WIN" ? "win" : "loss"}`} style={{ gridTemplateColumns: "70px 1fr 70px 70px 80px" }}>
              <span className={`result-badge ${m.result === "WIN" ? "result-win" : "result-loss"}`}>{m.result}</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{m.map}</span>
              <span className="mono" style={{ fontSize: 13 }}>{m.score}</span>
              <span className="mono" style={{ fontSize: 13 }}>{m.kd}</span>
              <span className="mono" style={{ fontSize: 13, color: m.result === "WIN" ? "var(--win)" : "var(--loss)" }}>{m.prize}</span>
            </div>
          ))}
          <button className="secondary-btn" style={{ width: "100%", marginTop: 12, fontSize: 12 }} onClick={() => setPage("analytics")}>Смотреть всё →</button>
        </div>

        {/* Quick stats */}
        <div className="card">
          <div className="card-title">📊 Аналитика за неделю</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Убийства по дням</div>
            <div className="chart-placeholder" style={{ height: 120 }}>
              {[18, 24, 15, 29, 21, 26, 24].map((v, i) => (
                <div key={i} className="bar" style={{ height: `${(v / 30) * 100}%` }} title={`${v} kills`} />
              ))}
            </div>
          </div>
          <div className="flex-between">
            <div className="pstat"><div className="val">{user.kills}</div><div className="lbl">Всего убийств</div></div>
            <div className="pstat"><div className="val" style={{ color: "var(--cyan)" }}>{user.hs}%</div><div className="lbl">Headshot %</div></div>
            <div className="pstat"><div className="val" style={{ color: "var(--win)" }}>1.{Math.floor(Math.random() * 5 + 2)}8</div><div className="lbl">HLTV Rating</div></div>
          </div>
        </div>
      </div>

      {/* Active rooms */}
      <div className="card">
        <div className="flex-between mb-20">
          <div className="card-title" style={{ marginBottom: 0 }}>🔥 Активные лобби</div>
          <button className="secondary-btn" style={{ fontSize: 12 }} onClick={() => setPage("rooms")}>Все лобби →</button>
        </div>
        <div className="grid-4">
          {ROOMS_DATA.slice(0, 4).map(r => (
            <div key={r.id} className="room-card" onClick={() => setPage("rooms")}>
              <div className="room-header">
                <div className="room-name">{r.name}</div>
                <div className={`room-status status-${r.status}`}>{r.status === "waiting" ? "ЖДЁТ" : "ИГРАЕТ"}</div>
              </div>
              <div className="room-meta">
                <span>🗺️ {r.map}</span>
                <span>👑 {r.creator}</span>
              </div>
              <div className="room-bet">
                <div><div className="bet-amount">{r.bet} SP</div><div className="bet-label">Ставка</div></div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 14, color: "var(--text)" }}>{r.players}/{r.maxPlayers}</div>
                  <div className="bet-label">Игроки</div>
                </div>
              </div>
              <div className="players-bar">
                <div className="players-bar-bg"><div className="players-bar-fill" style={{ width: `${(r.players / r.maxPlayers) * 100}%` }} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoomsPage({ user, showNotif }) {
  const [tab, setTab] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showLobby, setShowLobby] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [betAmount, setBetAmount] = useState(50);
  const [selectedMap, setSelectedMap] = useState("Mirage");

  const lvlData = LEVELS[user.level - 1];

  const lobbyPlayers = {
    team1: [
      { name: user.name, sp: user.sp, you: true },
      { name: "AimBot_pro", sp: 320 },
      { name: "Ghost_Sniper", sp: 180 },
      { name: "...", sp: null, empty: true },
      { name: "...", sp: null, empty: true },
    ],
    team2: [
      { name: "ShadowBlade", sp: 290 },
      { name: "FireStarter", sp: 410 },
      { name: "...", sp: null, empty: true },
      { name: "...", sp: null, empty: true },
      { name: "...", sp: null, empty: true },
    ],
  };

  return (
    <div>
      <div className="flex-between mb-20">
        <div className="tabs">
          {["all", "waiting", "playing"].map(t => (
            <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
              {t === "all" ? "Все" : t === "waiting" ? "Ищут игроков" : "Идёт матч"}
            </div>
          ))}
        </div>
        <button className="primary-btn" style={{ width: "auto", padding: "10px 24px" }} onClick={() => setShowCreate(true)}>
          ＋ Создать лобби
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {ROOMS_DATA.filter(r => tab === "all" || r.status === (tab === "waiting" ? "waiting" : "playing")).map(r => (
          <div key={r.id} className="room-card" onClick={() => r.status === "waiting" && setShowLobby(r)}>
            <div className="room-header">
              <div className="room-name">{r.name}</div>
              <div className={`room-status status-${r.status}`}>{r.status === "waiting" ? "ЖДЁТ" : "ИГРАЕТ"}</div>
            </div>
            <div className="room-meta">
              <span>🗺️ {r.map}</span>
              <span>👑 {r.creator}</span>
              <span style={{ marginLeft: "auto" }}>
                <span className="level-chip" style={{ background: `rgba(255,69,0,0.12)`, border: `1px solid rgba(255,69,0,0.3)`, color: "var(--fire)", borderRadius: 4, fontSize: 10, padding: "2px 6px", fontFamily: "Share Tech Mono" }}>
                  LVL {r.minLevel}+
                </span>
              </span>
            </div>
            <div className="room-bet">
              <div><div className="bet-amount">{r.bet} SP</div><div className="bet-label">Ставка за игрока</div></div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Share Tech Mono'", fontSize: 14, color: "var(--gold)" }}>{r.bet * 10} SP</div>
                <div className="bet-label">Общий банк</div>
              </div>
            </div>
            <div className="players-bar">
              <div className="players-bar-bg"><div className="players-bar-fill" style={{ width: `${(r.players / r.maxPlayers) * 100}%` }} /></div>
              <div className="players-text">{r.players}/{r.maxPlayers} игроков</div>
            </div>
            <button className="join-btn" disabled={r.status === "playing" || user.level < r.minLevel || user.sp < r.bet}>
              {r.status === "playing" ? "Матч идёт" : user.level < r.minLevel ? `Нужен уровень ${r.minLevel}` : user.sp < r.bet ? "Недостаточно SP" : "Присоединиться"}
            </button>
          </div>
        ))}
      </div>

      {/* Create Room Modal */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            <div className="modal-title">🎮 Создать лобби</div>
            <div className="level-info">
              <div className="level-row">
                <span>Ваш уровень:</span>
                <span className="level-highlight">LVL {user.level} — {lvlData?.name}</span>
              </div>
              <div className="level-row" style={{ marginTop: 6 }}>
                <span>Максимальная ставка:</span>
                <span className="level-highlight">{lvlData?.maxBet?.toLocaleString()} SP</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Название лобби</label>
              <input className="form-input" placeholder="Введите название..." value={roomName} onChange={e => setRoomName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Ставка за игрока (мин. 10 SP)</label>
              <input className="form-input" type="number" min="10" max={lvlData?.maxBet || 100} value={betAmount} onChange={e => setBetAmount(Number(e.target.value))} />
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>Общий банк: <span className="text-gold mono">{betAmount * 10} SP</span> · Победителям: <span className="text-win mono">{betAmount * 10 / 5} SP</span> каждому</div>
            </div>
            <div className="form-group">
              <label className="form-label">Карта</label>
              <select className="form-input" value={selectedMap} onChange={e => setSelectedMap(e.target.value)}>
                {MAPS.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
              </select>
            </div>
            <button className="primary-btn" onClick={() => { setShowCreate(false); showNotif("✅ Лобби создано!", `«${roomName || "Мой матч"}» · ${betAmount} SP ставка`); }}>
              Создать лобби
            </button>
          </div>
        </div>
      )}

      {/* Lobby Modal */}
      {showLobby && (
        <div className="modal-overlay" onClick={() => setShowLobby(null)}>
          <div className="modal" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLobby(null)}>✕</button>
            <div className="modal-title">🎯 {showLobby.name}</div>
            <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16 }}>Карта: <strong>{showLobby.map}</strong> · Ставка: <span className="text-gold mono">{showLobby.bet} SP</span></div>
            
            <div className="pot-display">
              <div className="pot-val">{showLobby.bet * 10} SP</div>
              <div className="pot-label">Общий банк турнира</div>
            </div>

            <div className="lobby-teams">
              <div className="team-box">
                <div className="team-box-title" style={{ color: "var(--fire)" }}>🔴 Команда 1</div>
                {lobbyPlayers.team1.map((p, i) => (
                  <div key={i} className="player-slot">
                    <div className="player-dot" style={{ background: p.empty ? "var(--text-muted)" : "var(--win)" }} />
                    <span style={{ color: p.empty ? "var(--text-muted)" : p.you ? "var(--gold)" : "var(--text)", fontSize: 13 }}>
                      {p.name} {p.you && "👑"}
                    </span>
                    {!p.empty && <span className="mono" style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-dim)" }}>{showLobby.bet} SP</span>}
                  </div>
                ))}
              </div>
              <div className="vs-badge">VS</div>
              <div className="team-box">
                <div className="team-box-title" style={{ color: "var(--cyan)" }}>🔵 Команда 2</div>
                {lobbyPlayers.team2.map((p, i) => (
                  <div key={i} className="player-slot">
                    <div className="player-dot" style={{ background: p.empty ? "var(--text-muted)" : "#00D4FF" }} />
                    <span style={{ color: p.empty ? "var(--text-muted)" : "var(--text)", fontSize: 13 }}>{p.name}</span>
                    {!p.empty && <span className="mono" style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-dim)" }}>{showLobby.bet} SP</span>}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ fontSize: 12, color: "var(--text-dim)", background: "var(--bg-dark)", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              🏆 Победители получат по <span className="text-win mono">{showLobby.bet * 2} SP</span> каждый (ставка команды проигравших делится поровну между победителями)
            </div>

            <button className="primary-btn" onClick={() => { setShowLobby(null); showNotif("🎮 Вы присоединились!", `Ставка ${showLobby.bet} SP списана с баланса`); }}>
              Войти в лобби — {showLobby.bet} SP
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PickBanPage() {
  const [mapStates, setMapStates] = useState(MAPS.map(m => ({ ...m, state: "none" }))); // none, banned, picked
  const [currentTeam, setCurrentTeam] = useState(1); // 1 or 2
  const [phase, setPhase] = useState("ban"); // ban or pick
  const [actions, setActions] = useState([]);
  const [step, setStep] = useState(0);
  // order: ban, ban, ban, ban, pick, pick, ban, ban, ban, pick (standard bo1)
  const ORDER = ["ban","ban","ban","ban","pick","pick","ban","ban","ban","pick"];

  const availableMaps = mapStates.filter(m => m.state === "none");
  const currentAction = step < ORDER.length ? ORDER[step] : null;

  const handleMap = (mapId) => {
    if (step >= ORDER.length) return;
    const action = ORDER[step];
    setMapStates(prev => prev.map(m => m.id === mapId ? { ...m, state: action === "ban" ? "banned" : "picked" } : m));
    setActions(prev => [...prev, { team: currentTeam, action, map: MAPS.find(m => m.id === mapId)?.name }]);
    setCurrentTeam(prev => prev === 1 ? 2 : 1);
    setStep(s => s + 1);
  };

  const reset = () => {
    setMapStates(MAPS.map(m => ({ ...m, state: "none" })));
    setCurrentTeam(1);
    setActions([]);
    setStep(0);
  };

  const done = step >= ORDER.length;
  const chosenMap = mapStates.find(m => m.state === "picked");

  return (
    <div className="pickban-container">
      <div className="pickban-header">
        <div className="team-section">
          <div className="team-label" style={{ color: currentTeam === 1 && !done ? "var(--fire)" : "var(--text-dim)" }}>🔴 Команда 1</div>
          {currentTeam === 1 && !done && <div className="team-action text-fire" style={{ fontFamily: "Share Tech Mono", fontSize: 12 }}>{phase === currentAction ? (currentAction === "ban" ? "БАН" : "ПИК") : ""}</div>}
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: 28, color: "var(--text-dim)" }}>ПИК / БАН</div>
          <div style={{ fontSize: 11, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 2, marginTop: 4 }}>
            Шаг {step + 1} из {ORDER.length}
          </div>
        </div>
        <div className="team-section" style={{ textAlign: "right" }}>
          <div className="team-label" style={{ color: currentTeam === 2 && !done ? "var(--cyan)" : "var(--text-dim)" }}>🔵 Команда 2</div>
        </div>
      </div>

      {!done && currentAction && (
        <div className="action-label mb-20">
          <div className="action-text">
            {currentTeam === 1 ? "🔴 Команда 1" : "🔵 Команда 2"} — {currentAction === "ban" ? "🚫 БАНИТ карту" : "✅ ВЫБИРАЕТ карту"}
          </div>
        </div>
      )}

      {done && chosenMap && (
        <div style={{ textAlign: "center", padding: "16px", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 10, marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: "var(--win)", fontFamily: "'Share Tech Mono'", letterSpacing: 2, textTransform: "uppercase" }}>✅ Карта выбрана!</div>
          <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 28, fontWeight: 700, marginTop: 4 }}>{chosenMap.name}</div>
        </div>
      )}

      <div className="maps-grid">
        {mapStates.map(m => (
          <div key={m.id} className={`map-card ${m.state === "banned" ? "banned" : m.state === "picked" ? "picked" : done || !currentAction ? "disabled" : ""}`}
            onClick={() => m.state === "none" && !done && handleMap(m.id)}>
            <img src={m.img} alt={m.name} onError={e => { e.target.style.display = "none"; }} />
            <div className="map-overlay">
              <div className="map-name">{m.name}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Action log */}
      {actions.length > 0 && (
        <div>
          <div className="divider" />
          <div className="card-title">📋 История действий</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {actions.map((a, i) => (
              <div key={i} style={{ padding: "6px 12px", borderRadius: 6, fontSize: 12, fontFamily: "'Share Tech Mono'", background: a.action === "ban" ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", border: `1px solid ${a.action === "ban" ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, color: a.action === "ban" ? "var(--loss)" : "var(--win)" }}>
                {a.action === "ban" ? "🚫" : "✅"} T{a.team}: {a.map}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <button className="secondary-btn" onClick={reset}>Сбросить</button>
      </div>
    </div>
  );
}

function AnalyticsPage({ user }) {
  const [tab, setTab] = useState("overview");
  const barData = [18, 24, 15, 29, 21, 26, 24, 19, 28, 22, 30, 25, 17, 23];
  const ratingData = [1.2, 1.45, 0.88, 1.67, 1.32, 1.12, 1.78, 1.55, 0.92, 1.43, 1.21, 1.89, 1.34, 1.56];
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const mapStats = [
    { map: "Mirage", matches: 42, wr: "61%", kd: "1.54" },
    { map: "Dust II", matches: 38, wr: "55%", kd: "1.32" },
    { map: "Inferno", matches: 29, wr: "69%", kd: "1.71" },
    { map: "Nuke", matches: 18, wr: "44%", kd: "0.98" },
    { map: "Ancient", matches: 22, wr: "59%", kd: "1.43" },
  ];

  // Heatmap data (7 days × 24 hours)
  const heatData = Array.from({ length: 7 * 24 }, () => Math.random());

  return (
    <div>
      <div className="tabs mb-20">
        {["overview", "maps", "weapons", "history"].map(t => (
          <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "overview" ? "Обзор" : t === "maps" ? "Карты" : t === "weapons" ? "Оружие" : "История"}
          </div>
        ))}
      </div>

      {tab === "overview" && (
        <>
          <div className="grid-4 mb-20">
            {[
              { val: (user.kills / user.deaths).toFixed(2), label: "K/D Ratio", color: "var(--fire)" },
              { val: `${user.hs}%`, label: "Headshot %", color: "var(--cyan)" },
              { val: "1.42", label: "HLTV Rating", color: "var(--gold)" },
              { val: `${Math.round((user.wins / (user.wins + user.losses)) * 100)}%`, label: "Win Rate", color: "var(--win)" },
            ].map((s, i) => (
              <div className="stat-card" key={i}>
                <div className="s-val" style={{ color: s.color }}>{s.val}</div>
                <div className="s-label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="grid-2 mb-20">
            <div className="card">
              <div className="card-title">📈 Убийства по матчам</div>
              <div className="chart-placeholder" style={{ height: 180 }}>
                {barData.map((v, i) => (
                  <div key={i} className="bar" style={{ height: `${(v / Math.max(...barData)) * 100}%` }} title={`${v} kills`} />
                ))}
              </div>
            </div>
            <div className="card">
              <div className="card-title">⭐ HLTV Rating по матчам</div>
              <div className="chart-placeholder" style={{ height: 180 }}>
                {ratingData.map((v, i) => (
                  <div key={i} className="bar" style={{ height: `${(v / 2) * 100}%`, background: v >= 1 ? "var(--gradient-fire)" : "linear-gradient(135deg, #EF4444, #B91C1C)" }} title={`Rating: ${v}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="card mb-20">
            <div className="card-title">🔥 Активность (последние 7 недель)</div>
            <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 2 }}>
                {days.map(d => <div key={d} style={{ fontSize: 10, color: "var(--text-dim)", height: 18, display: "flex", alignItems: "center", fontFamily: "'Share Tech Mono'" }}>{d}</div>)}
              </div>
              <div style={{ display: "grid", gridTemplateRows: "repeat(7, 18px)", gridAutoFlow: "column", gap: 3, flex: 1 }}>
                {heatData.map((v, i) => (
                  <div key={i} className="heat-cell" title={`${Math.round(v * 30)} матчей`}
                    style={{ background: v > 0.7 ? "var(--fire)" : v > 0.4 ? "rgba(255,69,0,0.5)" : v > 0.1 ? "rgba(255,69,0,0.2)" : "var(--bg-card2)", borderRadius: 3 }} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "maps" && (
        <div className="card">
          <div className="card-title">🗺️ Статистика по картам</div>
          <div style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 120px", gap: 12, padding: "10px 16px", background: "var(--bg-dark)", fontSize: 10, color: "var(--text-dim)", textTransform: "uppercase", letterSpacing: 1, fontFamily: "Share Tech Mono" }}>
              <span>Карта</span><span style={{ textAlign: "right" }}>Матчи</span><span style={{ textAlign: "right" }}>Win %</span><span style={{ textAlign: "right" }}>K/D</span><span>Win Rate</span>
            </div>
            {mapStats.map((m, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px 120px", gap: 12, padding: "12px 16px", borderTop: "1px solid var(--border)", alignItems: "center" }}>
                <span style={{ fontWeight: 600 }}>{m.map}</span>
                <span style={{ textAlign: "right", fontFamily: "Share Tech Mono", fontSize: 14 }}>{m.matches}</span>
                <span style={{ textAlign: "right", fontFamily: "Share Tech Mono", fontSize: 14, color: parseFloat(m.wr) >= 50 ? "var(--win)" : "var(--loss)" }}>{m.wr}</span>
                <span style={{ textAlign: "right", fontFamily: "Share Tech Mono", fontSize: 14, color: parseFloat(m.kd) >= 1 ? "var(--fire)" : "var(--text-dim)" }}>{m.kd}</span>
                <div style={{ background: "var(--bg-dark)", borderRadius: 4, height: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: m.wr, background: "var(--gradient-fire)", borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "weapons" && (
        <div className="grid-2">
          {[
            { name: "AK-47", kills: 342, hs: "48%", icon: "🔫" },
            { name: "M4A4", kills: 214, hs: "39%", icon: "🔫" },
            { name: "AWP", kills: 178, hs: "91%", icon: "🎯" },
            { name: "Desert Eagle", kills: 89, hs: "67%", icon: "🔫" },
          ].map((w, i) => (
            <div className="card" key={i}>
              <div className="flex-between mb-20">
                <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 20, fontWeight: 700 }}>{w.icon} {w.name}</div>
                <div style={{ fontFamily: "Share Tech Mono", fontSize: 14, color: "var(--fire)" }}>{w.kills} kills</div>
              </div>
              <div className="flex-between">
                <div className="pstat"><div className="val" style={{ color: "var(--cyan)", fontSize: 20 }}>{w.hs}</div><div className="lbl">Headshot %</div></div>
                <MiniBar values={Array.from({ length: 10 }, () => Math.floor(Math.random() * 40 + 10))} />
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className="card">
          <div className="card-title">📋 История матчей</div>
          <div className="match-header">
            <span>Результат</span><span>Карта</span><span>Счёт</span><span>K/D</span><span>Rating</span><span>Дата</span><span>SP</span>
          </div>
          {MATCH_HISTORY.map(m => (
            <div key={m.id} className={`match-row ${m.result === "WIN" ? "win" : "loss"}`}>
              <span className={`result-badge ${m.result === "WIN" ? "result-win" : "result-loss"}`}>{m.result}</span>
              <span style={{ fontWeight: 600 }}>{m.map}</span>
              <span className="mono">{m.score}</span>
              <span className="mono">{m.kd}</span>
              <span className="mono" style={{ color: m.rating >= 1 ? "var(--fire)" : "var(--loss)" }}>{m.rating}</span>
              <span style={{ color: "var(--text-dim)", fontSize: 12 }}>{m.date}</span>
              <span className="mono" style={{ color: m.result === "WIN" ? "var(--win)" : "var(--loss)" }}>{m.prize}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TournamentsPage({ user }) {
  const [showCreate, setShowCreate] = useState(false);
  const [tName, setTName] = useState("");
  const [tFormat, setTFormat] = useState("SE");
  const [tBet, setTBet] = useState(100);

  return (
    <div>
      <div className="flex-between mb-20">
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 18, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "var(--text-dim)" }}>
          Активные турниры
        </div>
        <button className="primary-btn" style={{ width: "auto", padding: "10px 24px" }} onClick={() => setShowCreate(true)}>
          🏆 Создать турнир
        </button>
      </div>

      {/* Featured tournament */}
      <div style={{ background: "linear-gradient(135deg, #12101E, #1A0E28)", border: "1px solid rgba(157,78,221,0.3)", borderRadius: 16, padding: 28, marginBottom: 24, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, right: -100, width: 300, height: 300, background: "radial-gradient(circle, rgba(157,78,221,0.1) 0%, transparent 70%)" }} />
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: "#9C27B0", letterSpacing: 3, textTransform: "uppercase", fontFamily: "Share Tech Mono", marginBottom: 6 }}>🔴 LIVE</div>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 28, fontWeight: 700 }}>FirePlay Open #1</div>
            <div style={{ color: "var(--text-dim)", fontSize: 13, marginTop: 4 }}>Single Elimination · 8 команд · 16 игроков</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: 30, color: "var(--gold)" }}>8,000 SP</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Призовой фонд</div>
          </div>
        </div>

        {/* Bracket */}
        <div style={{ overflowX: "auto" }}>
          <div className="bracket" style={{ gap: 0 }}>
            {TOURNAMENT_DATA.rounds.map((round, ri) => (
              <div key={ri} className="bracket-round" style={{ justifyContent: "space-around" }}>
                <div className="bracket-round-title">{round.name}</div>
                {round.matches.map((match, mi) => (
                  <div key={mi} className="bracket-match" style={{ marginBottom: ri === 0 ? 8 : ri === 1 ? 40 : 80 }}>
                    <div className={`bracket-team ${match.winner === 0 ? "winner" : ""} ${!match.team1 || match.team1 === "???" ? "tbd" : ""}`}>
                      <span>{match.team1 || "???"}</span>
                      {match.score1 !== null && <span className={`bracket-score ${match.winner === 0 ? "win" : ""}`}>{match.score1}</span>}
                    </div>
                    <div className={`bracket-team ${match.winner === 1 ? "winner" : ""} ${!match.team2 || match.team2 === "???" ? "tbd" : ""}`}>
                      <span>{match.team2 || "???"}</span>
                      {match.score2 !== null && <span className={`bracket-score ${match.winner === 1 ? "win" : ""}`}>{match.score2}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Other tournaments */}
      <div className="grid-3">
        {[
          { name: "Ночной кубок", prize: "2,000 SP", teams: "4/8", status: "Регистрация", format: "SE" },
          { name: "Pro League S1", prize: "15,000 SP", teams: "8/16", status: "Скоро", format: "DE" },
          { name: "Weekly Cup", prize: "500 SP", teams: "8/8", status: "Завершён", format: "SE" },
        ].map((t, i) => (
          <div className="card" key={i} style={{ cursor: "pointer" }}>
            <div className="flex-between" style={{ marginBottom: 12 }}>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 17, fontWeight: 700 }}>{t.name}</div>
              <div style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, fontFamily: "Share Tech Mono", background: t.status === "Регистрация" ? "rgba(255,69,0,0.15)" : t.status === "Скоро" ? "rgba(255,215,0,0.1)" : "rgba(107,114,128,0.2)", color: t.status === "Регистрация" ? "var(--fire)" : t.status === "Скоро" ? "var(--gold)" : "var(--text-dim)", border: "1px solid currentColor" }}>
                {t.status}
              </div>
            </div>
            <div style={{ fontFamily: "Share Tech Mono", fontSize: 22, color: "var(--gold)", marginBottom: 4 }}>{t.prize}</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)" }}>Команды: {t.teams} · {t.format === "SE" ? "Single Elim." : "Double Elim."}</div>
            {t.status === "Регистрация" && <button className="join-btn" style={{ marginTop: 12 }}>Зарегистрироваться</button>}
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            <div className="modal-title">🏆 Создать турнир</div>
            <div className="form-group">
              <label className="form-label">Название турнира</label>
              <input className="form-input" placeholder="FirePlay Cup #2..." value={tName} onChange={e => setTName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Формат</label>
              <select className="form-input" value={tFormat} onChange={e => setTFormat(e.target.value)}>
                <option value="SE">Single Elimination</option>
                <option value="DE">Double Elimination</option>
                <option value="RR">Round Robin</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Взнос за команду (SP)</label>
              <input className="form-input" type="number" value={tBet} onChange={e => setTBet(Number(e.target.value))} min="100" />
              <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 6 }}>Призовой фонд (8 команд): <span className="text-gold mono">{tBet * 8} SP</span></div>
            </div>
            <div className="form-group">
              <label className="form-label">Максимум команд</label>
              <select className="form-input">
                <option>4</option><option>8</option><option>16</option>
              </select>
            </div>
            <button className="primary-btn">Создать турнир</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfilePage({ user, setUser, showNotif }) {
  const lvlData = LEVELS[user.level - 1];
  const winRate = Math.round((user.wins / (user.wins + user.losses)) * 100);

  return (
    <div>
      <div className="profile-hero">
        <div className="profile-avatar">
          {user.name[0]}
          <div className="lvl-badge">{user.level}</div>
        </div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <div className="sub">⏰ В игре с {user.joinDate} · {user.country}</div>
          <XPBar xp={user.xp} level={user.level} />
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            {user.welcomeBonus && (
              <div style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.3)", color: "var(--gold)", fontFamily: "Share Tech Mono" }}>
                🎁 Новичок
              </div>
            )}
            <div style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: "rgba(255,69,0,0.1)", border: "1px solid rgba(255,69,0,0.3)", color: "var(--fire)", fontFamily: "Share Tech Mono" }}>
              {lvlData?.name}
            </div>
          </div>
        </div>
        <div className="profile-stats">
          {[
            { val: user.matches, lbl: "Матчей" },
            { val: `${winRate}%`, lbl: "Win Rate" },
            { val: (user.kills / user.deaths).toFixed(2), lbl: "K/D" },
            { val: `${user.hs}%`, lbl: "HS%" },
          ].map((s, i) => (
            <div className="pstat" key={i}>
              <div className="val">{s.val}</div>
              <div className="lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-2 mb-20">
        {/* Trophies */}
        <div className="card">
          <div className="card-title">🏆 Трофеи</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {TROPHIES.map(t => (
              <div className="trophy-card" key={t.id} style={{ borderColor: `${t.color}40` }}>
                <div className="trophy-icon" style={{ filter: `drop-shadow(0 0 8px ${t.color})` }}>{t.icon}</div>
                <div className="trophy-name" style={{ color: t.color }}>{t.name}</div>
                <div className="trophy-date">{t.date}</div>
              </div>
            ))}
            {/* Empty slots */}
            {[1, 2, 3].map(i => (
              <div key={i} className="trophy-card" style={{ opacity: 0.3, border: "1px dashed var(--border)" }}>
                <div className="trophy-icon">🔒</div>
                <div className="trophy-name" style={{ color: "var(--text-dim)" }}>Не получен</div>
              </div>
            ))}
          </div>
        </div>

        {/* Level progression */}
        <div className="card">
          <div className="card-title">⚡ Прогресс уровней</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {LEVELS.map(l => (
              <div key={l.level} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: user.level === l.level ? l.color : "var(--bg-dark)", border: `2px solid ${l.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, fontFamily: "Share Tech Mono", color: user.level === l.level ? "white" : l.color, flexShrink: 0 }}>
                  {l.level}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: user.level === l.level ? l.color : "var(--text-dim)" }}>{l.name}</span>
                    <span style={{ fontSize: 11, color: "var(--text-dim)", fontFamily: "Share Tech Mono" }}>Макс. {l.maxBet.toLocaleString()} SP</span>
                  </div>
                  <div style={{ background: "var(--bg-dark)", borderRadius: 4, height: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: user.level > l.level ? "100%" : user.level === l.level ? `${((user.xp - l.minXP) / (l.maxXP - l.minXP)) * 100}%` : "0%", background: l.color, borderRadius: 4 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="card">
        <div className="card-title">⚙️ Настройки профиля</div>
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label">Имя игрока</label>
            <input className="form-input" value={user.name} onChange={e => setUser(u => ({ ...u, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Steam ID</label>
            <input className="form-input" value="STEAM_0:1:12345678" readOnly style={{ opacity: 0.6 }} />
          </div>
        </div>
        <button className="primary-btn" style={{ width: "auto", padding: "10px 28px" }} onClick={() => showNotif("✅ Сохранено", "Профиль обновлён")}>Сохранить</button>
      </div>
    </div>
  );
}

function TopUpModal({ onClose, user, setUser, showNotif }) {
  const [selected, setSelected] = useState(null);
  const amounts = [
    { sp: 100, price: "$0.99" }, { sp: 250, price: "$1.99" }, { sp: 500, price: "$3.99" },
    { sp: 1000, price: "$7.99" }, { sp: 2500, price: "$14.99" }, { sp: 5000, price: "$24.99" },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-title">💎 Пополнение Strike Points</div>
        <div style={{ fontSize: 13, color: "var(--text-dim)", marginBottom: 16 }}>
          Текущий баланс: <span className="text-gold mono">{user.sp.toLocaleString()} SP</span>
        </div>
        <div className="amount-grid">
          {amounts.map((a, i) => (
            <div key={i} className={`amount-btn ${selected === i ? "selected" : ""}`} onClick={() => setSelected(i)}>
              <div>{a.sp.toLocaleString()}</div>
              <div className="amount-sub">SP · {a.price}</div>
            </div>
          ))}
        </div>
        <div className="form-group" style={{ marginTop: 8 }}>
          <label className="form-label">Метод оплаты</label>
          <select className="form-input">
            <option>💳 Банковская карта</option>
            <option>₿ Криптовалюта</option>
            <option>💰 PayPal</option>
            <option>🎮 Steam Wallet</option>
          </select>
        </div>
        {selected !== null && (
          <div style={{ padding: "10px 14px", background: "rgba(255,215,0,0.06)", border: "1px solid rgba(255,215,0,0.2)", borderRadius: 8, marginBottom: 12, fontSize: 13, color: "var(--gold)" }}>
            Будет зачислено: <strong className="mono">{amounts[selected].sp.toLocaleString()} SP</strong> за <strong>{amounts[selected].price}</strong>
          </div>
        )}
        <button className="primary-btn" disabled={selected === null} onClick={() => {
          if (selected !== null) {
            setUser(u => ({ ...u, sp: u.sp + amounts[selected].sp }));
            showNotif("✅ Пополнено!", `+${amounts[selected].sp.toLocaleString()} SP зачислены`);
            onClose();
          }
        }} style={{ opacity: selected === null ? 0.5 : 1 }}>
          {selected === null ? "Выберите сумму" : `Оплатить ${amounts[selected].price}`}
        </button>
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function FirePlayApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("home");
  const [showTopUp, setShowTopUp] = useState(false);
  const [notif, setNotif] = useState(null);
  const [user, setUser] = useState({
    name: "FlamePlayer",
    level: 2,
    xp: 850,
    sp: 100,
    matches: 47,
    wins: 27,
    losses: 20,
    kills: 1243,
    deaths: 895,
    hs: 52,
    country: "🇷🇺 Россия",
    joinDate: "Янв 2025",
    welcomeBonus: true,
  });

  const showNotif = (title, body) => {
    setNotif({ title, body });
    setTimeout(() => setNotif(null), 3100);
  };

  const NAV = [
    { id: "home", icon: "🏠", label: "Главная" },
    { id: "rooms", icon: "🎮", label: "Лобби" },
    { id: "pickban", icon: "🗺️", label: "Пик/Бан" },
    { id: "analytics", icon: "📊", label: "Аналитика" },
    { id: "tournaments", icon: "🏆", label: "Турниры" },
    { id: "profile", icon: "👤", label: "Профиль" },
  ];

  const PAGE_TITLES = {
    home: "Главная",
    rooms: "Лобби и матчи",
    pickban: "Пик / Бан карт",
    analytics: "Аналитика",
    tournaments: "Турниры",
    profile: "Профиль",
  };

  if (!loggedIn) {
    return (
      <>
        <style>{globalStyles}</style>
        <div className="landing">
          <div className="landing-grid" />
          <div className="landing-logo">FIREPLAY</div>
          <div className="landing-sub">CS2 Competitive Platform</div>

          <div className="landing-features">
            {[
              { icon: "🎮", title: "Лобби с ставками", desc: "Создавай комнаты, делай ставки Strike Points и играй за реальный приз" },
              { icon: "📊", title: "Детальная аналитика", desc: "Отслеживай K/D, Win Rate, рейтинг по картам и оружию" },
              { icon: "🏆", title: "Турниры", desc: "Участвуй в турнирах, получай трофеи и становись легендой" },
            ].map((f, i) => (
              <div className="feat-card" key={i}>
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          <button className="steam-btn" onClick={() => setLoggedIn(true)}>
            <div className="steam-icon">
              <svg width="28" height="28" viewBox="0 0 233 233" fill="white">
                <path d="M116.9 0C52.3 0 0 52.3 0 116.9c0 55 38.3 101 89.8 112.7l23.6-57.7c-5-1.7-9.8-4.2-14.1-7.6L52 183.8c-29.4-16.8-49.1-48.4-49.1-84.7C2.9 52.5 55.2 0.2 119.6 0.2h0.3l-.2-.2H116.9zM117 2.9c54.4 0 98.5 44.1 98.5 98.5s-44.1 98.5-98.5 98.5c-18.3 0-35.5-5-50.2-13.7L40.3 237c24.2 14.2 52.3 22.3 82.3 22.3 89.5 0 162-72.5 162-162S212.1 0 122.6 0c-4.7 0-9.4.2-14 .6L117 2.9z" />
              </svg>
            </div>
            Войти через Steam
          </button>

          <div className="bonus-notice">
            🎁 <strong>Приветственный бонус:</strong> 100 Strike Points бесплатно при первом входе!
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div className="app-container">
        {/* Sidebar */}
        <nav className="sidebar">
          <div className="logo-area">
            <div className="logo-icon">🔥</div>
            <div>
              <div className="logo-text">FIREPLAY</div>
              <div className="logo-sub">CS2 Platform</div>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-label">Навигация</div>
            {NAV.map(n => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </div>
            ))}
          </div>

          <div className="sidebar-sp">
            <div className="sp-label">Баланс</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
              <div className="sp-amount">{user.sp.toLocaleString()}</div>
              <div className="sp-unit">SP</div>
            </div>
            <button className="topup-btn" onClick={() => setShowTopUp(true)}>+ Пополнить</button>
          </div>
        </nav>

        {/* Main */}
        <div className="main-content">
          <div className="top-bar">
            <div className="page-title">{PAGE_TITLES[page]}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontFamily: "Share Tech Mono", fontSize: 12, color: "var(--text-dim)" }}>
                {user.sp.toLocaleString()} <span className="text-gold">SP</span>
              </div>
              <div className="user-chip" onClick={() => setPage("profile")}>
                <div className="avatar">{user.name[0]}</div>
                <div>
                  <div className="user-name">{user.name}</div>
                  <div className="user-level">LVL {user.level} · {LEVELS[user.level - 1]?.name}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="page-body">
            {page === "home" && <HomePage user={user} setUser={setUser} showNotif={showNotif} setPage={setPage} />}
            {page === "rooms" && <RoomsPage user={user} showNotif={showNotif} />}
            {page === "pickban" && <PickBanPage />}
            {page === "analytics" && <AnalyticsPage user={user} />}
            {page === "tournaments" && <TournamentsPage user={user} showNotif={showNotif} />}
            {page === "profile" && <ProfilePage user={user} setUser={setUser} showNotif={showNotif} />}
          </div>
        </div>

        {/* Modals */}
        {showTopUp && <TopUpModal onClose={() => setShowTopUp(false)} user={user} setUser={setUser} showNotif={showNotif} />}

        {/* Notification */}
        {notif && <Notification notif={notif} onClose={() => setNotif(null)} />}
      </div>
    </>
  );
}
