'use strict';

document.getElementById('year').textContent = new Date().getFullYear();

// ── Colour helpers ────────────────────────────────────────
const BTC    = '#F7931A';
const BTC_LT = 'rgba(247,147,26,0.15)';
const PURPLE = '#6c63ff';
const GREEN  = '#00ff88';
const RED    = '#ff4d4d';
const MUTED  = 'rgba(136,136,168,0.6)';
const GRID   = 'rgba(247,147,26,0.06)';

Chart.defaults.color = '#8888a8';
Chart.defaults.font.family = "'JetBrains Mono', monospace";
Chart.defaults.font.size = 11;

// ── Monthly price data (Jan 2015 – Jun 2025) ─────────────
const labels = [
  'янв. 15','апр. 15','июл. 15','окт. 15',
  'янв. 16','апр. 16','июл. 16','окт. 16',
  'янв. 17','апр. 17','июл. 17','окт. 17','дек. 17',
  'фев. 18','июн. 18','сен. 18','дек. 18',
  'мар. 19','июн. 19','сен. 19','дек. 19',
  'мар. 20','июн. 20','сен. 20','дек. 20',
  'фев. 21','апр. 21','июл. 21','окт. 21','ноя. 21',
  'янв. 22','май 22','июл. 22','ноя. 22','дек. 22',
  'мар. 23','июн. 23','окт. 23','дек. 23',
  'янв. 24','мар. 24','апр. 24','июн. 24','сен. 24','ноя. 24','дек. 24',
  'янв. 25','мар. 25','июн. 25',
];

const prices = [
  320, 240, 280, 330,
  430, 450, 650, 710,
  1000, 1300, 2500, 5800, 19783,
  8500, 6500, 6300, 3200,
  4000, 13800, 8200, 7200,
  3850, 9200, 10800, 29000,
  46000, 63500, 31000, 60000, 68789,
  38000, 29000, 20000, 16400, 16500,
  25000, 30000, 34000, 42000,
  47000, 73500, 65000, 60000, 62000, 99000, 95000,
  103600, 86000, 107000,
];

// Key event annotations (index into labels array)
const events = [
  { idx: 12, label: 'ATH 2017\n$19 783',  color: GREEN },
  { idx: 17, label: 'COVID дно\n$3 850',   color: RED },
  { idx: 29, label: 'ATH 2021\n$68 789',  color: GREEN },
  { idx: 33, label: 'Крах FTX\n$16k',     color: RED },
  { idx: 41, label: 'Спот ETF',            color: PURPLE },
  { idx: 48, label: 'Новый ATH\n$107k',   color: GREEN },
];

// ── Main price chart ──────────────────────────────────────
const priceCtx = document.getElementById('priceChart').getContext('2d');

const gradient = priceCtx.createLinearGradient(0, 0, 0, 380);
gradient.addColorStop(0,   'rgba(247,147,26,0.25)');
gradient.addColorStop(0.6, 'rgba(247,147,26,0.05)');
gradient.addColorStop(1,   'rgba(247,147,26,0)');

new Chart(priceCtx, {
  type: 'line',
  data: {
    labels,
    datasets: [{
      label: 'BTC/USD',
      data: prices,
      borderColor: BTC,
      borderWidth: 2,
      pointRadius: prices.map((_, i) => events.some(e => e.idx === i) ? 6 : 0),
      pointBackgroundColor: prices.map((_, i) => {
        const ev = events.find(e => e.idx === i);
        return ev ? ev.color : BTC;
      }),
      pointBorderWidth: 2,
      pointBorderColor: '#08080e',
      fill: true,
      backgroundColor: gradient,
      tension: 0.4,
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f1f35',
        borderColor: 'rgba(247,147,26,0.3)',
        borderWidth: 1,
        padding: 12,
        titleColor: '#F7931A',
        bodyColor: '#e8e8f0',
        callbacks: {
          label: ctx => ' $' + ctx.raw.toLocaleString('ru-RU'),
        },
      },
    },
    scales: {
      x: {
        grid: { color: GRID },
        ticks: { maxRotation: 45, maxTicksLimit: 14 },
      },
      y: {
        type: 'logarithmic',
        grid: { color: GRID },
        ticks: {
          callback: v => v >= 1000 ? '$' + (v/1000).toFixed(0) + 'k' : '$' + v,
        },
      },
    },
  },
});

// ── Drawdown chart ────────────────────────────────────────
const ddCtx = document.getElementById('drawdownChart').getContext('2d');

const cycles    = ['2013 цикл\n(дек. 2013)', '2017 цикл\n(дек. 2017)', '2021 цикл\n(ноябрь 2021)', '2022 дно\n(ноябрь 2022)'];
const drawdowns = [-87, -84, -77, -77];
const ddColors  = drawdowns.map(v => v <= -80 ? RED : 'rgba(255,77,77,0.7)');

new Chart(ddCtx, {
  type: 'bar',
  data: {
    labels: cycles,
    datasets: [{
      label: 'Просадка от ATH (%)',
      data: drawdowns,
      backgroundColor: ddColors,
      borderColor: RED,
      borderWidth: 1,
      borderRadius: 6,
    }],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f1f35',
        borderColor: 'rgba(255,77,77,0.3)',
        borderWidth: 1,
        callbacks: { label: ctx => ' ' + ctx.raw + '%' },
      },
    },
    scales: {
      x: { grid: { color: GRID } },
      y: {
        grid: { color: GRID },
        ticks: { callback: v => v + '%' },
        max: 0,
        min: -100,
      },
    },
  },
});

// ── Return comparison chart ───────────────────────────────
const retCtx = document.getElementById('returnChart').getContext('2d');

const assets  = ['Биткоин (BTC)', 'S&P 500', 'Золото', 'Облигации США', 'Наличные (инфляция)'];
const returns = [32300, 340, 85, 30, -28];
const retColors = returns.map(r =>
  r > 1000 ? BTC :
  r > 0    ? 'rgba(108,99,255,0.7)' :
  RED
);

new Chart(retCtx, {
  type: 'bar',
  data: {
    labels: assets,
    datasets: [{
      label: 'Общая доходность % (2015 → 2025)',
      data: returns,
      backgroundColor: retColors,
      borderColor: retColors.map(c => c.replace('0.7', '1')),
      borderWidth: 1,
      borderRadius: 6,
    }],
  },
  options: {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f1f35',
        borderColor: BTC_LT,
        borderWidth: 1,
        callbacks: {
          label: ctx => ' ' + ctx.raw.toLocaleString('ru-RU') + '%',
          afterLabel: ctx => ctx.raw > 0
            ? ' $1 000 → $' + ((1000 * (1 + ctx.raw / 100)).toLocaleString('ru-RU', {maximumFractionDigits: 0}))
            : '',
        },
      },
    },
    scales: {
      x: {
        grid: { color: GRID },
        ticks: { callback: v => v.toLocaleString('ru-RU') + '%' },
      },
      y: { grid: { display: false } },
    },
  },
});

// ── Intersection observer for reveal ─────────────────────
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .tl-item, .takeaway-card, .stat-card')
  .forEach(el => { el.classList.add('reveal'); io.observe(el); });
