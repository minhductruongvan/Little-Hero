(() => {
  window.createLittleHeroCharacterModel = ({ freshState, escapeHtml }) => {
    const outfitIds = ["classic", "hero", "anime", "anime-orange", "anime-navy", "anime-rose", "anime-shadow", "robot-blue", "space", "fairy", "dino"];
    const colorOptions = {
      hairColor: ["#624337", "#302820", "#b76532", "#d7a33e", "#7257a5"],
      shirt: ["#53b99d", "#f48665", "#8d82d4", "#568fc7", "#e96fa2", "#f1c34e", "#398bc8", "#e87836", "#3d536f", "#c77ba4", "#594b60", "#4ba6c5"],
      pants: ["#5e7296", "#8d82d4", "#578f72", "#e96fa2", "#345f7b", "#354d62", "#30384a", "#425c71", "#386b83"],
      shoes: ["#f3a552", "#e98257", "#568fc7", "#e96fa2", "#de6549", "#5a6676", "#c56978", "#448eaa"]
    };
    const safeWardrobe = (closet = {}) => {
      const defaults = freshState().closet;
      return {
        gender: ["boy", "girl"].includes(closet.gender) ? closet.gender : defaults.gender,
        hair: ["short", "curly", "long", "ponytail", "braids"].includes(closet.hair) ? closet.hair : defaults.hair,
        hairColor: colorOptions.hairColor.includes(closet.hairColor) ? closet.hairColor : defaults.hairColor,
        shirt: colorOptions.shirt.includes(closet.shirt) ? closet.shirt : defaults.shirt,
        pants: colorOptions.pants.includes(closet.pants) ? closet.pants : defaults.pants,
        shoes: colorOptions.shoes.includes(closet.shoes) ? closet.shoes : defaults.shoes,
        accessory: ["star", "cape", "glasses", "none"].includes(closet.accessory) ? closet.accessory : defaults.accessory,
        outfit: outfitIds.includes(closet.outfit) ? closet.outfit : (closet.outfit === "anime" ? "anime-orange" : defaults.outfit)
      };
    };

    const renderHeroCharacterSvg = (outfit = safeWardrobe(), options = {}) => {
      const closet = safeWardrobe(outfit);
      const skin = options.skin || "#f2c39e";
      const adult = Boolean(options.adult);
      const referenceClosets = [
        freshState().closet,
        { gender: "boy", hair: "curly", hairColor: "#624337", shirt: "#53b99d", pants: "#536f92", shoes: "#e98257", accessory: "cape", outfit: "classic" }
      ];
      if (!options.civilian && !adult && referenceClosets.some((reference) => Object.keys(reference).every((key) => closet[key] === reference[key]))) {
        return `<svg class="hero-character-svg hero-character-reference" viewBox="0 0 300 450" role="img" aria-label="${escapeHtml(options.ariaLabel || "Nhân vật Hero")}">
          <circle cx="150" cy="200" r="120" fill="#E8F7F2"/>
          <circle cx="150" cy="200" r="120" fill="none" stroke="#A2D2C2" stroke-width="2" stroke-dasharray="5 5"/>
          <ellipse cx="150" cy="410" rx="60" ry="8" fill="rgba(0,0,0,.12)"/>
          <image href="./frontend/assets/hero-character.png" x="20" y="20" width="260" height="390" preserveAspectRatio="xMidYMid meet"/>
        </svg>`;
      }
      const hairColor = closet.hairColor;
      const hairBack = ["long", "ponytail", "braids"].includes(closet.hair)
        ? `<path d="M57 64Q58 25 100 24Q143 25 143 68L138 125Q131 143 123 111L78 111Q73 143 62 128Z" fill="${hairColor}"/>`
        : "";
      const hairTop = closet.hair === "curly"
        ? `<path d="M55 75Q48 63 56 52Q51 38 66 34Q68 19 84 24Q95 11 108 22Q124 14 135 30Q151 35 145 51Q154 65 142 77Q133 79 127 67Q117 78 108 66Q98 79 87 67Q75 78 67 66Z" fill="${hairColor}"/><path d="M61 52Q70 37 82 43Q94 32 104 43Q116 31 128 43Q136 39 143 50Q130 64 118 57Q108 70 97 59Q84 69 74 58Q67 61 61 52Z" fill="${hairColor}"/>`
        : `<path d="M54 76Q49 58 54 41Q58 18 81 20Q96 7 112 17Q136 17 145 40Q152 59 144 77L135 71Q132 57 124 47Q112 58 97 54Q78 55 67 43Q62 57 63 76Z" fill="${hairColor}"/><path d="M63 43Q76 53 94 53Q116 55 133 39L138 53Q130 67 117 61Q107 72 96 62Q82 70 72 61Q66 58 63 53Z" fill="${hairColor}"/>`;
      const hairSides = closet.hair === "short" || closet.hair === "curly"
        ? `<path d="M58 47Q54 61 59 84Q62 93 69 94L72 62Z M142 47Q146 61 141 84Q138 93 131 94L128 62Z" fill="${hairColor}"/>`
        : `<path d="M57 45Q53 69 59 96Q62 108 70 111L74 64Z M143 45Q147 69 141 96Q138 108 130 111L126 64Z" fill="${hairColor}"/>`;
      const hairStyle = closet.hair === "ponytail"
        ? `<path d="M135 49Q165 45 156 75Q151 89 140 91L132 79Z" fill="${hairColor}"/>`
        : closet.hair === "braids"
          ? `<path d="M62 57Q50 69 61 103L68 119L75 113L70 72ZM137 57Q150 69 139 103L132 119L125 113L130 72Z" fill="${hairColor}"/>`
          : "";
      const hairHighlights = `<path d="M68 38Q81 17 103 24M113 23Q132 25 141 45" fill="none" stroke="#ffffff" stroke-opacity=".22" stroke-width="4" stroke-linecap="round"/><path d="M64 49q-4 12 0 22m72-23q6 12 2 23" fill="none" stroke="#241b18" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/>`;
      const glasses = closet.accessory === "glasses"
        ? '<g fill="none" stroke="#47768a" stroke-width="3.5"><circle cx="85" cy="76" r="12"/><circle cx="117" cy="76" r="12"/><path d="M97 75h8M72 74l-8-3m68 3 8-3"/></g>'
        : "";
      const chestAccessory = options.civilian ? ""
        : ["space", "robot-blue"].includes(closet.outfit)
        ? '<circle cx="101" cy="129" r="11" fill="#f4f7ff" stroke="#8395d8" stroke-width="3"/><circle cx="101" cy="129" r="5" fill="#77c9e8"/>'
        : ["fairy", "anime-rose"].includes(closet.outfit)
          ? '<path d="m100 115 4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1Z" fill="#ffdf72" stroke="#d5a83e" stroke-width="2"/>'
          : closet.outfit === "dino"
            ? '<path d="M90 119Q100 108 110 119L108 142L100 137L92 142Z" fill="#fff0a6" stroke="#5c9d69" stroke-width="2"/>'
            : closet.outfit.startsWith("anime-") || closet.outfit === "anime"
              ? '<path d="M87 120L100 115L113 120L109 143L100 137L91 143Z" fill="#fff7d2" stroke="#e78b55" stroke-width="2"/>'
              : closet.accessory === "cape" || closet.outfit === "classic" || closet.outfit === "hero"
                ? '<circle cx="100" cy="130" r="16" fill="#eafaff" stroke="#287e9b" stroke-width="4"/><circle cx="100" cy="130" r="8" fill="#65bad2"/>'
                : closet.accessory === "star"
                  ? '<path d="m100 115 4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1Z" fill="#ffdc74" stroke="#d5a83e" stroke-width="2"/>'
                  : "";
      const cape = options.civilian ? ""
        : closet.outfit === "fairy"
          ? '<path class="hero-cape" d="M67 103Q100 91 133 103L158 180Q100 165 42 180Z" fill="#dc85dc" opacity=".78"/>'
          : closet.accessory === "cape" || closet.outfit === "dino" || closet.outfit === "hero" || closet.outfit.startsWith("anime-")
            ? `<path class="hero-cape" d="M67 103Q100 91 133 103L153 187Q101 177 48 187Z" fill="${closet.outfit === "dino" ? "#62ad63" : "var(--hero-cape,var(--hero-shirt,#53b99d))"}" stroke="#286d70" stroke-width="4"/>`
            : "";
      const girlSkirt = closet.gender === "girl" && !adult
        ? '<path d="M65 151Q100 162 135 151L145 187Q100 197 55 187Z" fill="var(--hero-pants,#e96fa2)" stroke="#765066" stroke-width="3"/><path d="M72 160q28 8 56 0" fill="none" stroke="#ffffff50" stroke-width="3"/>'
        : "";
      const civilianDetails = options.civilian
        ? `<path d="M78 108l13 10-8 12m39-22-13 10 8 12" fill="none" stroke="#ffffffd9" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
           <path d="M101 121v31" stroke="#ffffff99" stroke-width="3"/><circle cx="101" cy="130" r="2.5" fill="#fff"/><circle cx="101" cy="143" r="2.5" fill="#fff"/>
           ${adult ? '<path d="M76 150h17v5H76m31-5h17v5h-17" fill="#ffffff5c"/>' : '<path d="M70 109 77 106 83 113 75 119m50-13 8 4-5 8-8-6" fill="#ffffff8c"/>'}`
        : "";
      const hairBow = options.hairAccessory === "flower"
        ? '<g transform="translate(139 48)" stroke="#fff" stroke-width="2"><circle cx="-7" cy="0" r="6" fill="#ed78a7"/><circle cx="7" cy="0" r="6" fill="#ed78a7"/><circle cy="-7" r="6" fill="#ed78a7"/><circle cy="7" r="6" fill="#ed78a7"/><circle r="4" fill="#ffd45e"/></g>'
        : options.hairAccessory === "bow"
          ? '<path d="M137 47Q151 34 151 49Q151 61 137 53Q124 62 125 48Q126 36 137 47Z" fill="#ed78a7" stroke="#fff" stroke-width="2"/>'
          : "";

      return `<svg class="hero-character-svg" viewBox="0 0 200 ${adult ? 275 : 250}" role="img" aria-label="${escapeHtml(options.ariaLabel || "Nhân vật Hero")}">
        <ellipse cx="100" cy="235" rx="49" ry="8" fill="#43516b" opacity=".14"/>
        <g class="character-pose" ${adult ? 'transform="scale(1 1.1)"' : ""}>
        <g class="character-movement">
        ${cape}${hairBack}
        <g class="hero-leg-left" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M84 157Q79 178 81 187L78 211" stroke="var(--hero-pants,#5e7296)" stroke-width="21"/>
          <path d="M68 225Q69 211 81 211H91Q95 218 91 231H67Z" fill="var(--hero-shoes,#f3a552)" stroke="#8f5138" stroke-width="3"/>
          <path d="M68 229h23m-15-14 7 8m0-9 7 8" stroke="#fff0d4" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <g class="hero-leg-right" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M116 157Q121 178 119 187L122 211" stroke="var(--hero-pants,#5e7296)" stroke-width="21"/>
          <path d="M109 231Q105 218 109 211H120Q132 211 133 225L133 231Z" fill="var(--hero-shoes,#f3a552)" stroke="#8f5138" stroke-width="3"/>
          <path d="M110 229h23m-15-14 7 8m0-9 7 8" stroke="#fff0d4" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <g class="hero-arm-left" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M68 111Q57 122 53 137" stroke="var(--hero-shirt,#53b99d)" stroke-width="19"/>
          <path d="M53 137Q48 148 50 157" stroke="${skin}" stroke-width="13"/>
          <path d="M48 153q-7 5-4 12 5 6 12 0l2-5" fill="${skin}" stroke="#ad7050" stroke-width="2"/>
          <path d="M47 160v5m4-5v6m4-6v5" stroke="#ad7050" stroke-width="1.5" stroke-linecap="round"/>
        </g>
        <g class="hero-arm-right" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path d="M132 111Q143 122 147 135" stroke="var(--hero-shirt,#53b99d)" stroke-width="19"/>
          <path d="M147 135Q152 144 150 152" stroke="${skin}" stroke-width="13"/>
          <path d="M148 148q-7 5-4 12 5 6 12 0l2-5" fill="${skin}" stroke="#ad7050" stroke-width="2"/>
          <path d="M147 155v5m4-5v6m4-6v5" stroke="#ad7050" stroke-width="1.5" stroke-linecap="round"/>
        </g>
        <g class="hero-body">
          <path d="M68 103Q100 92 132 103L139 162Q100 177 61 162Z" fill="var(--hero-shirt,#53b99d)" stroke="#287e76" stroke-width="4"/>
          ${closet.outfit.startsWith("anime") ? '<path d="M72 109L83 103L92 113L100 107L108 113L117 103L130 110L124 119L117 115L119 151L81 151L83 115L76 119Z" fill="#fff7ed" opacity=".65"/>' : ""}
          ${closet.outfit === "space" || closet.outfit === "robot-blue" ? '<path d="M76 109L83 104L89 109H111L117 104L125 109L120 117V151H80V117Z" fill="#e7f2ff" opacity=".8"/>' : ""}
          ${closet.outfit === "dino" ? '<path d="M68 105L59 119L68 127M132 105L141 119L132 127" fill="none" stroke="#fff3b0" stroke-width="6"/>' : ""}
          ${civilianDetails}${girlSkirt}
        </g>
        <path d="M87 101V94H113V101" fill="${skin}"/>
        <g class="hero-head">
          <ellipse cx="100" cy="65" rx="42" ry="46" fill="${skin}" stroke="#ad7050" stroke-width="4"/>
          ${hairTop}${hairStyle}${hairSides}
          <path class="face-brows" d="M74 64q10-9 21-2m11 0q11-7 21 2" fill="none" stroke="#674536" stroke-width="4" stroke-linecap="round"/>
          <ellipse cx="85" cy="77" rx="7" ry="9" fill="#fff"/><ellipse cx="115" cy="77" rx="7" ry="9" fill="#fff"/>
          <ellipse cx="85" cy="78" rx="4.3" ry="6" fill="#493832"/><ellipse cx="115" cy="78" rx="4.3" ry="6" fill="#493832"/>
          <circle cx="86.5" cy="75.5" r="1.8" fill="#fff"/><circle cx="116.5" cy="75.5" r="1.8" fill="#fff"/>
          <path d="M100 81q-5 7 1 9" fill="none" stroke="#ce8c69" stroke-width="2" stroke-linecap="round"/>
          <ellipse cx="72" cy="91" rx="7" ry="4" fill="#e98e78" opacity=".5"/><ellipse cx="128" cy="91" rx="7" ry="4" fill="#e98e78" opacity=".5"/>
          <path class="face-mouth" d="M92 96Q100 103 108 96" fill="none" stroke="#994f47" stroke-width="3" stroke-linecap="round"/>
          ${glasses}${hairHighlights}${hairBow}
        </g>
        ${chestAccessory}
        </g></g>
      </svg>`;
    };

    const renderLessonCharacterSvg = (profile = {}, options = {}) => {
      const color = (value, fallback) => /^#[\da-f]{6}$/i.test(value || "") ? value : fallback;
      const skin = color(profile.skin, "#f2c39e");
      const shirt = color(profile.shirt, "#55a98c");
      const pants = color(profile.pants, "#536f92");
      const hair = color(profile.hairColor, "#624337");
      const size = profile.adult ? "adult" : "child";
      const ariaLabel = escapeHtml(options.ariaLabel || profile.name || "Nhân vật bài học");
      const hairShape = profile.hair === "curly"
        ? `<path d="M42 59Q34 43 48 34Q48 17 64 19Q76 5 88 17Q105 9 111 27Q129 26 128 44L119 66 106 54 57 57Z" fill="${hair}" stroke="#392d30" stroke-width="4" stroke-linejoin="round"/>`
        : `<path d="M43 60Q36 28 59 17Q87 2 109 19Q129 33 119 62L109 55Q103 39 94 37Q78 51 53 42L49 62Z" fill="${hair}" stroke="#392d30" stroke-width="4" stroke-linejoin="round"/>`;
      const hairBack = ["long", "braids"].includes(profile.hair)
        ? `<path d="M48 43Q38 68 47 94Q54 103 62 93L60 57m49-14q11 27 2 52-7 10-15 0l2-39" fill="${hair}" stroke="#392d30" stroke-width="4" stroke-linejoin="round"/>`
        : profile.hair === "ponytail"
          ? `<path d="M111 37q26-7 22 17l-10 24-14-10Z" fill="${hair}" stroke="#392d30" stroke-width="4"/>`
          : "";
      return `<svg class="lesson-character-svg lesson-character-${size}" viewBox="0 0 160 250" role="img" aria-label="${ariaLabel}">
        <ellipse cx="80" cy="239" rx="32" ry="7" fill="#354354" opacity=".16"/>
        <g class="lesson-movement">
          <g class="lesson-legs">
            <g class="lesson-leg-left"><path d="M66 160 63 195" fill="none" stroke="#463d4b" stroke-width="21" stroke-linecap="round"/><path d="M66 160 63 195" fill="none" stroke="${pants}" stroke-width="15" stroke-linecap="round"/><circle cx="63" cy="195" r="8" fill="${pants}"/><g class="lesson-knee-left"><path d="M63 195 62 218" fill="none" stroke="#463d4b" stroke-width="17" stroke-linecap="round"/><path d="M63 195 62 218" fill="none" stroke="${pants}" stroke-width="11" stroke-linecap="round"/><g class="lesson-foot-left"><path d="M62 218q-15 0-17 12h34q0-9-17-12Z" fill="#fff9ee" stroke="#463d4b" stroke-width="4" stroke-linejoin="round"/><path d="M48 226h25" stroke="#e7a980" stroke-width="2.5" stroke-linecap="round"/></g></g></g>
            <g class="lesson-leg-right"><path d="M94 160 97 195" fill="none" stroke="#463d4b" stroke-width="21" stroke-linecap="round"/><path d="M94 160 97 195" fill="none" stroke="${pants}" stroke-width="15" stroke-linecap="round"/><circle cx="97" cy="195" r="8" fill="${pants}"/><g class="lesson-knee-right"><path d="M97 195 98 218" fill="none" stroke="#463d4b" stroke-width="17" stroke-linecap="round"/><path d="M97 195 98 218" fill="none" stroke="${pants}" stroke-width="11" stroke-linecap="round"/><g class="lesson-foot-right"><path d="M98 218q15 0 17 12H81q0-9 17-12Z" fill="#fff9ee" stroke="#463d4b" stroke-width="4" stroke-linejoin="round"/><path d="M87 226h25" stroke="#e7a980" stroke-width="2.5" stroke-linecap="round"/></g></g></g>
          </g>
          <g class="lesson-upper">
            <g class="lesson-arms">
              <g class="lesson-arm-left"><path d="M59 111 44 135" fill="none" stroke="#463d4b" stroke-width="18" stroke-linecap="round"/><path d="M59 111 44 135" fill="none" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/><circle cx="44" cy="135" r="7" fill="${shirt}" stroke="#463d4b" stroke-width="3"/><g class="lesson-forearm-left"><path d="M44 135 45 159" fill="none" stroke="#463d4b" stroke-width="17" stroke-linecap="round"/><path d="M44 135 45 159" fill="none" stroke="${shirt}" stroke-width="11" stroke-linecap="round"/><path d="M39 160q-2 7 5 8 7-1 6-8Z" fill="${skin}" stroke="#805b49" stroke-width="2"/></g></g>
              <g class="lesson-arm-right"><path d="M101 111 116 135" fill="none" stroke="#463d4b" stroke-width="18" stroke-linecap="round"/><path d="M101 111 116 135" fill="none" stroke="${shirt}" stroke-width="12" stroke-linecap="round"/><circle cx="116" cy="135" r="7" fill="${shirt}" stroke="#463d4b" stroke-width="3"/><g class="lesson-forearm-right"><path d="M116 135 115 159" fill="none" stroke="#463d4b" stroke-width="17" stroke-linecap="round"/><path d="M116 135 115 159" fill="none" stroke="${shirt}" stroke-width="11" stroke-linecap="round"/><path d="M110 160q-1 7 5 8 7-1 6-8Z" fill="${skin}" stroke="#805b49" stroke-width="2"/></g></g>
            </g>
            <path d="M72 91h16v20H72Z" fill="${skin}" stroke="#805b49" stroke-width="2"/>
            <path class="lesson-torso" d="M59 108q21-13 42 0l10 53q-29 17-62 0Z" fill="${shirt}" stroke="#463d4b" stroke-width="4" stroke-linejoin="round"/>
            <path d="M70 109 80 120 90 109M80 120v11" fill="none" stroke="#ffffffd9" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M65 143q15 8 30 0v15q-15 8-30 0Z" fill="#ffffff24" stroke="#ffffff77" stroke-width="2"/>
            <circle cx="80" cy="140" r="3" fill="#fff4d6"/><circle cx="80" cy="151" r="3" fill="#fff4d6"/>
            <g class="lesson-head">
              <path d="M43 59Q43 24 78 19 115 18 118 56L115 78Q110 99 82 101 54 99 47 78Z" fill="${skin}" stroke="#463d4b" stroke-width="4"/>
              <ellipse cx="45" cy="67" rx="7" ry="10" fill="${skin}" stroke="#463d4b" stroke-width="3"/><ellipse cx="116" cy="67" rx="7" ry="10" fill="${skin}" stroke="#463d4b" stroke-width="3"/>
              ${hairBack}${hairShape}
              <path class="lesson-face-brows" d="M60 58q8-5 16 0m8 0q8-5 16 0" fill="none" stroke="#463d4b" stroke-width="3" stroke-linecap="round"/>
              <ellipse cx="69" cy="69" rx="6" ry="8" fill="#fff"/><ellipse cx="91" cy="69" rx="6" ry="8" fill="#fff"/>
              <circle cx="70" cy="70" r="3.5" fill="#342e3b"/><circle cx="92" cy="70" r="3.5" fill="#342e3b"/>
              <circle cx="71" cy="69" r="1.3" fill="#fff"/><circle cx="93" cy="69" r="1.3" fill="#fff"/>
              <path d="M80 73q-4 6 1 7" fill="none" stroke="#a9785a" stroke-width="2" stroke-linecap="round"/>
              <ellipse cx="59" cy="81" rx="7" ry="4" fill="#ec8c91" opacity=".66"/><ellipse cx="101" cy="81" rx="7" ry="4" fill="#ec8c91" opacity=".66"/>
              <path class="lesson-face-mouth" d="M73 82q7 8 14 0" fill="none" stroke="#74404a" stroke-width="3" stroke-linecap="round"/>
            </g>
          </g>
        </g>
      </svg>`;
    };

    const setCharacterExpression = (actor, expression) => {
      const lessonCharacter = actor?.querySelector(".lesson-character-svg");
      const mouth = actor?.querySelector(lessonCharacter ? ".lesson-face-mouth" : ".face-mouth");
      const brows = actor?.querySelector(lessonCharacter ? ".lesson-face-brows" : ".face-brows");
      if (!mouth || !brows) return;
      const expressions = {
        happy: lessonCharacter
          ? { mouth: "M73 80q7 9 14 0", brows: "M60 58q8-5 16 0m8 0q8-5 16 0" }
          : { mouth: "M92 96Q100 103 108 96", brows: "M74 64q10-9 21-2m11 0q11-7 21 2" },
        calm: lessonCharacter
          ? { mouth: "M74 83q6 2 12 0", brows: "M60 58q8-3 16 0m8 0q8-3 16 0" }
          : { mouth: "M94 99q6 2 12 0", brows: "M74 64q10-5 21 0m11 0q11-5 21 0" },
        sad: lessonCharacter
          ? { mouth: "M73 87q7-7 14 0", brows: "M60 60q8-4 16 1m8 1q8-5 16-1" }
          : { mouth: "M92 100Q100 93 108 100", brows: "M74 65q10-5 21 2m11 2q11-7 21-2" },
        angry: lessonCharacter
          ? { mouth: "M74 87h12", brows: "M60 56l16 5m28-5-16 5" }
          : { mouth: "M92 100Q100 93 108 100", brows: "m74 62 21 6m32-6-21 6" },
        concerned: lessonCharacter
          ? { mouth: "M74 85q6-4 12 0", brows: "M60 58q8-4 16 1m8 1q8-5 16-1" }
          : { mouth: "M94 100Q100 96 106 100", brows: "M74 64q10-6 21 1m11 1q11-7 21-1" }
      };
      const face = expressions[expression] || expressions.happy;
      mouth.setAttribute("d", face.mouth);
      brows.setAttribute("d", face.brows);
    };

    return { safeWardrobe, renderHeroCharacterSvg, renderLessonCharacterSvg, setCharacterExpression };
  };
})();
