const SIGNALS = {
  battery: [129, 57, '<rect x="22" y="36" width="74" height="39" rx="5"/><path d="M96 48h8v15h-8M30 57h17"/>'],
  sleep: [126, 51, '<path d="M18 64h20L18 84h20m10-42h24L48 66h24m5-47h26L77 45h26"/>'],
  moon: [125, 44, '<path d="M75 17c-30 10-32 53 5 65-28 18-63-1-62-29 1-29 34-49 57-36Z"/><path d="M93 26v16m-8-8h16"/>'],
  focus: [126, 41, '<circle cx="59" cy="58" r="31"/><circle cx="59" cy="58" r="13"/><path d="M59 16v14m0 56v14m42-42H87m-56 0H17"/>'],
  mood: [126, 58, '<path d="M19 24h83v58H60l-19 15V82H19Z"/><path d="M38 47h6m30 0h6m-39 21 11-7 13 7 14-7"/>'],
  head: [120, 39, '<path d="M72 13 44 48l21 4-21 39 47-50-24-3 16-22zM20 43l12 7m62 19 10 6M32 23l8 9"/>'],
  balance: [125, 46, '<path d="M86 48c-6-29-57-36-67-7-10 27 23 53 48 40 14-7 9-28-3-32-10-4-19 8-12 14m39-23-4 14-13-7"/><path d="M92 77v14m-7-7h14"/>'],
  stomach: [125, 107, '<path d="M38 17v28c0 7 8 11 14 7 11-8 8-32 31-28 16 3 21 20 16 34-6 20-28 31-44 22-10-6-16-3-21 6l-5 8H14l8-18c6-11 14-14 22-14 4 0 5-4 3-6-10-7-20-4-20-21V17"/>'],
  meal: [126, 104, '<rect x="16" y="29" width="87" height="56" rx="9"/><circle cx="43" cy="57" r="13"/><path d="M68 44h19m-19 13h19m-19 13h19"/>'],
  drop: [126, 84, '<path d="M59 17c-10 18-29 37-29 53a29 29 0 0 0 58 0c0-16-19-35-29-53Z"/><path d="M45 70c0 8 5 14 12 15"/>'],
  leg: [145, 142, '<path d="m44 18-9 35 29 16-12 27m12-78-10 30 25 14-9 34H52"/><path d="m85 52 14-8m-12 20h16m-21 12 12 8"/>'],
  arm: [173, 93, '<path d="M32 82c-4-21 2-31 12-39l7-7V24h22l5 16-17 8-4 19c11-7 24-6 33 4 5 6 4 14 2 17H34Z"/><path d="M65 69c5 0 12 2 17 7"/>'],
  hand: [177, 116, '<path d="M41 97V74L25 57c-4-6 2-11 7-8l11 10V27c0-6 9-6 9 0v19-25c0-6 9-6 9 0v25-21c0-6 9-6 9 0v24-15c0-6 9-6 9 0v31c0 12-9 14-9 24v8Z"/><path d="m91 24 9-6m-10 19h11m-67-8-8-7"/>'],
  mouth: [129, 70, '<path d="M15 57c16-12 29-19 44-13 14-6 27 1 44 13-16 19-30 24-44 24S31 76 15 57Zm1 0h86m-58 0v11m15-11v11m15-11v11M82 86l-5 9"/>'],
  bruise: [155, 99, '<path d="m22 67 52-33c10-7 23 6 18 14L41 86c-10 7-25-11-19-19Z"/><circle cx="60" cy="57" r="11"/><circle cx="48" cy="63" r="6"/>'],
  face: [126, 58, '<circle cx="60" cy="54" r="35"/><path d="M44 49h4m25 0h4m-29 23c8-7 17-7 24 0m-38-10 10-2m32 0 10 2"/>'],
  eye: [125, 55, '<path d="M15 55c25-31 63-31 88 0-25 31-63 31-88 0Z"/><circle cx="59" cy="55" r="13"/><path d="M34 20l-5-7m32 5v-9m24 11 5-7"/>'],
  lungs: [126, 95, '<path d="M59 14v34m0-1-13 9m13-9 13 9M50 37c-8-11-21-2-28 16-5 14-6 30 4 34 13 3 24-7 24-18V37Zm18 0c8-11 21-2 28 16 5 14 6 30-4 34-13 3-24-7-24-18V37Z"/>'],
  chest: [128, 93, '<path d="M59 87 24 55c-15-14 1-41 22-30l13 9 13-9c21-11 37 16 22 30L59 87Z"/><path d="M14 59h25l9-13 12 24 12-11h35"/>'],
  half: [146, 91, '<circle cx="59" cy="30" r="14"/><path d="M59 49v30m0-30H30m29 0 22 16m-22 14L44 99m15-20 15 20M59 8v96" stroke-dasharray="5 4"/>']
};

export function symptomArt(motif, urgent) {
  const [x, y, symbol] = SIGNALS[motif];
  const highlight = urgent ? "#ffc291" : "#d4f68e";
  return `<svg viewBox="0 0 410 180" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
    <rect width="410" height="180" fill="#1d3b2f"/>
    <path d="M0 41h410M0 81h410M0 121h410M0 161h410M26 0v180m40-180v180m40-180v180m40-180v180m40-180v180m40-180v180m40-180v180m40-180v180m40-180v180m40-180v180" stroke="#325545" stroke-width="1"/>
    <path d="M16 31V17h18m356 14V17h-18M16 149v14h18m356-14v14h-18" fill="none" stroke="#79a071" stroke-width="2"/>
    <path d="M112 28h32l10 10v31l-10 9h-32l-10-9V38Z" fill="#d8e8c7" stroke="#0f281e" stroke-width="3"/>
    <path d="M111 42h34v20l-7 6h-20l-7-6Z" fill="#8eb59a" stroke="#355848" stroke-width="3"/>
    <path d="M118 48h20v12l-4 4h-12l-4-4Z" fill="#e8ba92"/>
    <path d="M121 52h2m10 0h2m-10 7h6" stroke="#2c4434" stroke-width="2" stroke-linecap="round"/>
    <path d="M104 78h45l17 14 16 28-15 10-16-23-2 27 8 33h-24l-5-26-5 26H99l8-33-2-26-16 22-15-10 16-28Z" fill="#c9dbb9" stroke="#132e23" stroke-width="3" stroke-linejoin="round"/>
    <path d="M112 85h32v26h-32z" fill="#88ab85" stroke="#456b50" stroke-width="2"/>
    <path d="M119 92h8v8h-8z" fill="#d7f197"/><path d="M132 94h6m-6 5h6M109 133h39" stroke="#59785a" stroke-width="2"/>
    <path d="M${x} ${y}h49l41 32h33" stroke="${highlight}" stroke-width="2" stroke-linejoin="round" fill="none"/>
    <circle class="sym-art-signal" cx="${x}" cy="${y}" r="9" fill="#264a38" stroke="${highlight}" stroke-width="2.5"/>
    <circle cx="${x}" cy="${y}" r="3" fill="${highlight}"/>
    <rect x="249" y="25" width="133" height="129" rx="8" fill="#162f26" stroke="#759775" stroke-width="2"/>
    <g transform="translate(254 34)" fill="none" stroke="${highlight}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${symbol}</g>
  </svg>`;
}
