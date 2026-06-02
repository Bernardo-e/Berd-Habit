import { getPlantGrowthInfo } from '../utils/dataHelper';

export default function VirtualPlant({ streak, isDrooping = false }) {
  const info = getPlantGrowthInfo(streak);
  
  // Custom plant renderer based on stage
  const renderSVGPlant = () => {
    const swayClass = isDrooping ? 'opacity-75 origin-bottom scale-y-90' : 'animate-leaf-sway';
    
    switch (info.stage) {
      case 'Seed':
        return (
          <g>
            {/* Ambient soil mound */}
            <path d="M30 160 C 60 142, 140 142, 170 160 C 140 165, 60 165, 30 160 Z" fill="url(#soil-grad-1)" filter="url(#soft-shadow)" />
            <path d="M50 160 C 75 148, 125 148, 150 160 C 125 163, 75 163, 50 160 Z" fill="url(#soil-grad-2)" />
            
            {/* Organic soil speckles */}
            <circle cx="78" cy="158" r="1.5" fill="#29150B" />
            <circle cx="122" cy="157" r="1.2" fill="#1C0E07" />
            <circle cx="105" cy="159" r="1" fill="#3D2010" />

            {/* Split seed pod */}
            <g>
              <path d="M 94 153 C 94 148, 98 143, 100 144 C 98 147, 96 150, 96 154" fill="url(#seed-shell-grad)" stroke="#27150A" strokeWidth="0.75" />
              <path d="M 106 153 C 106 148, 102 143, 100 144 C 102 147, 104 150, 104 154" fill="url(#seed-shell-grad)" stroke="#27150A" strokeWidth="0.75" />
            </g>

            {/* Glowing Sprout */}
            <g className="animate-pulse">
              <circle cx="101" cy="132" r="10" fill="url(#glow-grad)" />
            </g>
            
            <path d="M 100 147 Q 99 138, 101 132" fill="none" stroke="url(#stem-grad)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 101 132 C 96 128, 94 133, 101 132 Z" fill="url(#leaf-grad-front)" />
            <path d="M 101 132 C 106 127, 108 132, 101 132 Z" fill="url(#leaf-grad-front)" />
            
            {/* Floating starlight particles */}
            <circle cx="90" cy="125" r="1.5" fill="#A7F3D0" className="animate-float-1" />
            <circle cx="112" cy="128" r="1" fill="#6EE7B7" className="animate-float-2" />
          </g>
        );
        
      case 'Sprout':
        return (
          <g>
            {/* Ambient soil mound */}
            <path d="M30 160 C 60 142, 140 142, 170 160 C 140 165, 60 165, 30 160 Z" fill="url(#soil-grad-1)" filter="url(#soft-shadow)" />
            <path d="M50 160 C 75 148, 125 148, 150 160 C 125 163, 75 163, 50 160 Z" fill="url(#soil-grad-2)" />
            
            {/* Seed pod remnants at the base */}
            <path d="M 94 156 C 94 152, 97 151, 98 153" fill="none" stroke="#5F3414" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 106 156 C 106 152, 103 151, 102 153" fill="none" stroke="#5F3414" strokeWidth="1.5" strokeLinecap="round" />

            {/* Tapering Stem */}
            <path d="M 100 155 C 97 135, 98 118, 104 104" fill="none" stroke="url(#stem-grad)" strokeWidth="3.5" strokeLinecap="round" />
            
            {/* Left Leaf sways */}
            <g transform="translate(104, 104) rotate(-35)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -12 -8, -18 -20, -6 -30 C 2 -32, 8 -18, 0 0 Z" fill="url(#leaf-grad-front)" filter="url(#soft-shadow)" />
              <path d="M 0 0 C -4 -10, -5 -20, -6 -30" fill="none" stroke="#047857" strokeWidth="0.75" opacity="0.6" />
              
              {/* Dew drop */}
              <ellipse cx="-6" cy="-30" rx="2" ry="3" fill="#60A5FA" opacity="0.9" className="animate-pulse" />
              <circle cx="-5.5" cy="-31" r="0.6" fill="#FFFFFF" opacity="0.8" />
            </g>

            {/* Right Leaf sways */}
            <g transform="translate(104, 104) rotate(40)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -6 -10, -8 -22, 2 -26 C 10 -22, 8 -12, 0 0 Z" fill="url(#leaf-grad-back)" />
              <path d="M 0 0 C 1 -8, 2 -16, 2 -26" fill="none" stroke="#064E3B" strokeWidth="0.75" opacity="0.6" />
            </g>
          </g>
        );
        
      case 'Small Plant':
        return (
          <g>
            {/* Ambient soil mound */}
            <path d="M30 160 C 60 142, 140 142, 170 160 C 140 165, 60 165, 30 160 Z" fill="url(#soil-grad-1)" filter="url(#soft-shadow)" />
            <path d="M50 160 C 75 148, 125 148, 150 160 C 125 163, 75 163, 50 160 Z" fill="url(#soil-grad-2)" />
            
            {/* Main stem */}
            <path d="M 100 155 C 97 125, 101 100, 102 75" fill="none" stroke="url(#stem-grad)" strokeWidth="5" strokeLinecap="round" />
            
            {/* Side branch left */}
            <path d="M 99 118 C 90 110, 84 104, 80 98" fill="none" stroke="url(#stem-grad)" strokeWidth="3" strokeLinecap="round" />
            <g transform="translate(80, 98) rotate(-55)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -12 -6, -18 -18, -6 -28 C 4 -28, 8 -16, 0 0 Z" fill="url(#leaf-grad-front)" filter="url(#soft-shadow)" />
              <path d="M 0 0 C -4 -10, -5 -18, -6 -28" fill="none" stroke="#047857" strokeWidth="0.75" opacity="0.6" />
            </g>

            {/* Side branch right */}
            <path d="M 101 102 C 110 96, 116 92, 122 86" fill="none" stroke="url(#stem-grad)" strokeWidth="3" strokeLinecap="round" />
            <g transform="translate(122, 86) rotate(55)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -6 -10, -8 -22, 2 -26 C 10 -22, 8 -12, 0 0 Z" fill="url(#leaf-grad-back)" />
              <path d="M 0 0 C 1 -8, 2 -16, 2 -26" fill="none" stroke="#064E3B" strokeWidth="0.75" opacity="0.6" />
            </g>

            {/* Top Leaf Left */}
            <g transform="translate(102, 75) rotate(-20)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -10 -8, -14 -22, -4 -32 C 4 -32, 6 -18, 0 0 Z" fill="url(#leaf-grad-front)" filter="url(#soft-shadow)" />
              <path d="M 0 0 C -3 -10, -4 -20, -4 -32" fill="none" stroke="#047857" strokeWidth="0.75" opacity="0.6" />
            </g>

            {/* Top Leaf Right */}
            <g transform="translate(102, 75) rotate(25)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -4 -10, -6 -24, 4 -28 C 12 -24, 10 -14, 0 0 Z" fill="url(#leaf-grad-back)" />
              <path d="M 0 0 C 1 -10, 2 -20, 4 -28" fill="none" stroke="#064E3B" strokeWidth="0.75" opacity="0.6" />
            </g>

            {/* Extra Leaf off trunk */}
            <g transform="translate(98, 130) rotate(-65)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -10 -6, -15 -16, -5 -24 C 3 -24, 6 -14, 0 0 Z" fill="url(#leaf-grad-back)" />
            </g>
          </g>
        );
        
      case 'Blooming Plant':
        return (
          <g>
            {/* Ambient soil mound */}
            <path d="M30 160 C 60 142, 140 142, 170 160 C 140 165, 60 165, 30 160 Z" fill="url(#soil-grad-1)" filter="url(#soft-shadow)" />
            <path d="M50 160 C 75 148, 125 148, 150 160 C 125 163, 75 163, 50 160 Z" fill="url(#soil-grad-2)" />
            
            {/* Root systems slightly showing */}
            <path d="M 95 156 Q 88 164, 82 170" fill="none" stroke="url(#root-grad)" strokeWidth="3" strokeLinecap="round" />
            <path d="M 105 156 Q 112 165, 118 171" fill="none" stroke="url(#root-grad)" strokeWidth="2.5" strokeLinecap="round" />

            {/* Robust Stalk */}
            <path d="M 100 155 C 96 120, 102 90, 102 60" fill="none" stroke="url(#stem-grad)" strokeWidth="6.5" strokeLinecap="round" />
            
            {/* Branches */}
            <path d="M 98 122 C 86 112, 75 106, 68 100" fill="none" stroke="url(#stem-grad)" strokeWidth="3" strokeLinecap="round" />
            <path d="M 101 106 C 114 96, 126 90, 134 82" fill="none" stroke="url(#stem-grad)" strokeWidth="3" strokeLinecap="round" />

            {/* Leaves */}
            {/* Left Branch Leaf 1 */}
            <g transform="translate(68, 100) rotate(-45)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -14 -8, -20 -22, -8 -32 C 4 -32, 10 -18, 0 0 Z" fill="url(#leaf-grad-front)" filter="url(#soft-shadow)" />
              <path d="M 0 0 C -4 -10, -5 -20, -8 -32" fill="none" stroke="#047857" strokeWidth="0.75" opacity="0.6" />
            </g>
            {/* Left Branch Leaf 2 */}
            <g transform="translate(82, 114) rotate(-75)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -10 -6, -15 -16, -5 -24 C 3 -24, 6 -14, 0 0 Z" fill="url(#leaf-grad-back)" />
            </g>
            {/* Right Branch Leaf 1 */}
            <g transform="translate(134, 82) rotate(45)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -6 -10, -8 -24, 4 -28 C 12 -24, 10 -14, 0 0 Z" fill="url(#leaf-grad-front)" filter="url(#soft-shadow)" />
            </g>
            {/* Right Branch Leaf 2 */}
            <g transform="translate(118, 96) rotate(70)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -8 -5, -12 -14, -4 -20 C 2 -20, 5 -12, 0 0 Z" fill="url(#leaf-grad-back)" />
            </g>
            {/* Top Center Leaf */}
            <g transform="translate(102, 60) rotate(-10)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -12 -8, -16 -24, -4 -34 C 6 -34, 8 -20, 0 0 Z" fill="url(#leaf-grad-front)" filter="url(#soft-shadow)" />
            </g>
            {/* Top Right Leaf */}
            <g transform="translate(102, 60) rotate(30)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 0 C -4 -10, -6 -24, 4 -28 C 12 -24, 10 -14, 0 0 Z" fill="url(#leaf-grad-back)" />
            </g>

            {/* Beautiful Detailed Blossoms */}
            {/* Center Top Flower */}
            <g transform="translate(102, 45)" className="animate-bloom">
              {/* Back petals */}
              <path d="M 0 0 C -12 -12, -22 -6, -20 6 C -18 12, -8 8, 0 0 Z" fill="url(#flower-grad-pink)" />
              <path d="M 0 0 C 12 -12, 22 -6, 20 6 C 18 12, 8 8, 0 0 Z" fill="url(#flower-grad-pink)" />
              <path d="M 0 0 C -8 -18, 8 -18, 0 0 Z" fill="url(#flower-grad-pink)" />
              
              {/* Stamens */}
              <path d="M -4 0 L -6 -12" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" />
              <circle cx="-6" cy="-12" r="1.2" fill="#F59E0B" />
              <path d="M 4 0 L 6 -12" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" />
              <circle cx="6" cy="-12" r="1.2" fill="#F59E0B" />
              <path d="M 0 0 L 0 -15" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" />
              <circle cx="0" cy="-15" r="1.2" fill="#F59E0B" />
              
              {/* Front petals */}
              <path d="M 0 0 C -14 -4, -12 10, -2 8 C 8 8, 10 -4, 0 0 Z" fill="url(#flower-grad-purple)" opacity="0.9" />
              <circle cx="0" cy="3" r="2.5" fill="#FDE047" />
            </g>

            {/* Left Branch Flower */}
            <g transform="translate(62, 94) scale(0.7)" className="animate-bloom" style={{ animationDelay: '0.3s' }}>
              <path d="M 0 0 C -12 -12, -22 -6, -20 6 C -18 12, -8 8, 0 0 Z" fill="url(#flower-grad-pink)" />
              <path d="M 0 0 C 12 -12, 22 -6, 20 6 C 18 12, 8 8, 0 0 Z" fill="url(#flower-grad-pink)" />
              <path d="M 0 0 C -8 -18, 8 -18, 0 0 Z" fill="url(#flower-grad-pink)" />
              <path d="M 0 0 L 0 -15" stroke="#FBBF24" strokeWidth="1" />
              <circle cx="0" cy="-15" r="1.2" fill="#F59E0B" />
              <path d="M 0 0 C -14 -4, -12 10, -2 8 C 8 8, 10 -4, 0 0 Z" fill="url(#flower-grad-purple)" opacity="0.9" />
              <circle cx="0" cy="3" r="2.5" fill="#FDE047" />
            </g>

            {/* Right Branch Flower */}
            <g transform="translate(136, 76) scale(0.65)" className="animate-bloom" style={{ animationDelay: '0.5s' }}>
              <path d="M 0 0 C -12 -12, -22 -6, -20 6 C -18 12, -8 8, 0 0 Z" fill="url(#flower-grad-pink)" />
              <path d="M 0 0 C 12 -12, 22 -6, 20 6 C 18 12, 8 8, 0 0 Z" fill="url(#flower-grad-pink)" />
              <path d="M 0 0 C -8 -18, 8 -18, 0 0 Z" fill="url(#flower-grad-pink)" />
              <path d="M 0 0 L 0 -15" stroke="#FBBF24" strokeWidth="1" />
              <circle cx="0" cy="-15" r="1.2" fill="#F59E0B" />
              <path d="M 0 0 C -14 -4, -12 10, -2 8 C 8 8, 10 -4, 0 0 Z" fill="url(#flower-grad-purple)" opacity="0.9" />
              <circle cx="0" cy="3" r="2.5" fill="#FDE047" />
            </g>

            {/* Glowing Pollen */}
            <circle cx="92" cy="38" r="1.2" fill="#FDE047" className="animate-float-1" />
            <circle cx="115" cy="34" r="1.5" fill="#FFFBEB" className="animate-float-2" />
            <circle cx="56" cy="84" r="1" fill="#FDE047" className="animate-float-3" />
          </g>
        );
        
      case 'Young Tree':
        return (
          <g>
            {/* Ambient soil mound */}
            <path d="M30 160 C 60 142, 140 142, 170 160 C 140 165, 60 165, 30 160 Z" fill="url(#soil-grad-1)" filter="url(#soft-shadow)" />
            <path d="M50 160 C 75 148, 125 148, 150 160 C 125 163, 75 163, 50 160 Z" fill="url(#soil-grad-2)" />
            
            {/* Roots */}
            <path d="M 94 156 Q 84 168, 70 174" fill="none" stroke="url(#root-grad)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M 106 156 Q 116 168, 130 174" fill="none" stroke="url(#root-grad)" strokeWidth="4" strokeLinecap="round" />

            {/* Textured trunk */}
            <path d="M 90 155 C 93 125, 96 95, 96 80 L 104 80 C 104 95, 107 125, 110 155 Z" fill="url(#trunk-grad)" filter="url(#soft-shadow)" />
            <path d="M 96 155 C 98 125, 99 105, 99 80" fill="none" stroke="#270F02" strokeWidth="1" opacity="0.3" />
            <path d="M 104 155 C 102 125, 101 105, 101 80" fill="none" stroke="#270F02" strokeWidth="1" opacity="0.3" />

            {/* Branches */}
            <path d="M 96 105 C 80 92, 70 85, 62 76" fill="none" stroke="url(#trunk-grad)" strokeWidth="4" strokeLinecap="round" />
            <path d="M 104 95 C 120 85, 130 78, 138 70" fill="none" stroke="url(#trunk-grad)" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M 100 80 Q 94 65, 88 56" fill="none" stroke="url(#trunk-grad)" strokeWidth="3" strokeLinecap="round" />
            <path d="M 100 80 Q 106 65, 112 56" fill="none" stroke="url(#trunk-grad)" strokeWidth="3" strokeLinecap="round" />

            {/* Dense Organic Canopies */}
            {/* Left Canopy Cluster */}
            <g transform="translate(62, 76)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 5 C -15 0, -25 -10, -20 -25 C -15 -35, 5 -35, 10 -25 C 20 -25, 25 -10, 15 5 Z" fill="url(#leaf-grad-back)" filter="url(#soft-shadow)" />
              <path d="M -5 0 C -16 -4, -20 -14, -14 -24 C -8 -30, 8 -30, 10 -20 C 18 -18, 16 -8, 8 0 Z" fill="url(#leaf-grad-front)" />
              <path d="M -20 -15 C -28 -14, -32 -20, -20 -22" fill="url(#leaf-grad-front)" stroke="#047857" strokeWidth="0.5" />
              <path d="M 18 -12 C 24 -15, 26 -8, 18 -6" fill="url(#leaf-grad-front)" stroke="#047857" strokeWidth="0.5" />
            </g>

            {/* Right Canopy Cluster */}
            <g transform="translate(138, 70)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M -5 5 C -20 0, -25 -15, -15 -28 C -5 -38, 15 -35, 20 -22 C 25 -12, 15 5, 0 5 Z" fill="url(#leaf-grad-back)" filter="url(#soft-shadow)" />
              <path d="M -8 0 C -18 -4, -20 -14, -12 -24 C -4 -30, 12 -28, 14 -18 C 18 -10, 10 2, -2 0 Z" fill="url(#leaf-grad-front)" />
              <path d="M 18 -16 C 26 -20, 24 -12, 18 -10" fill="url(#leaf-grad-front)" stroke="#047857" strokeWidth="0.5" />
            </g>

            {/* Center Top Canopy Cluster */}
            <g transform="translate(100, 50) scale(1.15)" className={swayClass} style={{ transformOrigin: '0px 0px' }}>
              <path d="M 0 5 C -20 0, -30 -15, -22 -30 C -15 -42, 15 -42, 22 -30 C 30 -15, 20 5, 0 5 Z" fill="url(#leaf-grad-back)" filter="url(#soft-shadow)" />
              <path d="M -4 0 C -16 -4, -22 -16, -16 -26 C -10 -36, 10 -36, 16 -26 C 22 -16, 16 -4, 4 0 Z" fill="url(#leaf-grad-front)" />
              <path d="M -22 -24 C -30 -28, -26 -34, -18 -30" fill="url(#leaf-grad-front)" stroke="#047857" strokeWidth="0.5" />
              <path d="M 22 -24 C 30 -28, 26 -34, 18 -30" fill="url(#leaf-grad-front)" stroke="#047857" strokeWidth="0.5" />
            </g>
          </g>
        );
        
      case 'Flourishing Tree':
        return (
          <g>
            {/* Shimmering Halo / Ambient Glow behind tree */}
            <circle cx="100" cy="55" r="75" fill="url(#halo-grad)" className="animate-pulse" />

            {/* Grass clumps at base */}
            <path d="M 45 158 Q 42 152, 38 154 Q 44 153, 48 158" fill="url(#leaf-grad-front)" />
            <path d="M 155 158 Q 158 152, 162 154 Q 156 153, 152 158" fill="url(#leaf-grad-front)" />

            {/* Ancient Winding Roots wrapping crystals */}
            <path d="M 88 156 C 80 166, 65 178, 52 184" fill="none" stroke="url(#root-grad)" strokeWidth="7.5" strokeLinecap="round" />
            <path d="M 112 156 C 120 166, 135 178, 148 184" fill="none" stroke="url(#root-grad)" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M 100 156 C 101 172, 98 185, 96 195" fill="none" stroke="url(#root-grad)" strokeWidth="8" strokeLinecap="round" />

            {/* Glowing crystal minerals in root bed */}
            <polygon points="50,186 56,180 62,187 54,192" fill="#60A5FA" opacity="0.85" className="animate-pulse" filter="url(#glow-filter)" />
            <polygon points="144,186 152,179 156,188 147,193" fill="#10B981" opacity="0.8" className="animate-pulse" />

            {/* Massive ancient trunk */}
            <path d="M 76 156 C 80 120, 90 90, 88 65 L 112 65 C 110 90, 120 120, 124 156 Z" fill="url(#trunk-grad)" filter="url(#soft-shadow)" />
            
            {/* Trunk bark ridges */}
            <path d="M 94 156 C 96 122, 99 90, 98 65" fill="none" stroke="#270F02" strokeWidth="2.5" opacity="0.35" />
            <path d="M 106 156 C 104 122, 101 90, 102 65" fill="none" stroke="#270F02" strokeWidth="2.5" opacity="0.35" />
            <path d="M 100 156 C 100 110, 102 85, 100 65" fill="none" stroke="#270F02" strokeWidth="3" opacity="0.4" />

            {/* Swaying branches & leaves canopy group */}
            <g className="animate-gentle-sway">
              {/* Majestic widespread branches (mostly hidden, peeking through gaps) */}
              <path d="M 88 95 C 65 85, 48 78, 32 68" fill="none" stroke="url(#trunk-grad)" strokeWidth="7.5" strokeLinecap="round" />
              <path d="M 112 90 C 135 80, 152 72, 168 62" fill="none" stroke="url(#trunk-grad)" strokeWidth="7" strokeLinecap="round" />
              <path d="M 90 75 Q 70 55, 55 42" fill="none" stroke="url(#trunk-grad)" strokeWidth="5.5" strokeLinecap="round" />
              <path d="M 110 72 Q 130 52, 145 40" fill="none" stroke="url(#trunk-grad)" strokeWidth="5" strokeLinecap="round" />
              <path d="M 96 65 Q 85 45, 80 32" fill="none" stroke="url(#trunk-grad)" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M 104 65 Q 115 45, 120 32" fill="none" stroke="url(#trunk-grad)" strokeWidth="4.5" strokeLinecap="round" />

              {/* Back Canopy Layers (Deep Forest Green) */}
              <path d="M 20 70 C 10 50, 20 20, 50 30 C 60 20, 80 20, 90 35 C 75 55, 50 70, 20 70 Z" fill="url(#leaf-grad-back)" opacity="0.9" />
              <path d="M 180 70 C 190 50, 180 20, 150 30 C 140 20, 120 20, 110 35 C 125 55, 150 70, 180 70 Z" fill="url(#leaf-grad-back)" opacity="0.9" />
              <path d="M 50 35 C 50 15, 80 5, 100 15 C 120 5, 150 15, 150 35 C 130 45, 70 45, 50 35 Z" fill="url(#leaf-grad-back)" opacity="0.9" />

              {/* Front Canopy Layers (Moss, Emerald & Teal) */}
              {/* Left Wing Canopy */}
              <path d="M 25 70 C 10 55, 15 35, 35 30 C 45 15, 70 15, 80 30 C 90 40, 85 65, 75 75 C 60 85, 40 80, 25 70 Z" fill="url(#leaf-grad-front)" filter="url(#soft-shadow)" />
              {/* Right Wing Canopy */}
              <path d="M 175 70 C 190 55, 185 35, 165 30 C 155 15, 130 15, 120 30 C 110 40, 115 65, 125 75 C 140 85, 160 80, 175 70 Z" fill="url(#leaf-grad-teal)" filter="url(#soft-shadow)" />
              {/* Center Canopy Crown */}
              <path d="M 55 45 C 45 30, 60 10, 85 12 C 100 -2, 120 -2, 130 15 C 150 10, 160 30, 150 48 C 140 60, 115 65, 100 60 C 85 65, 65 60, 55 45 Z" fill="url(#leaf-grad-teal)" filter="url(#soft-shadow)" />
              {/* Top Center Highlight Layer */}
              <path d="M 70 35 C 65 25, 80 15, 95 18 C 105 8, 120 10, 125 22 C 135 22, 140 32, 135 42 C 128 50, 112 52, 100 48 C 88 52, 75 48, 70 35 Z" fill="url(#leaf-grad-front)" />
              {/* Lower Canopy Fill */}
              <path d="M 45 80 C 35 70, 50 55, 65 60 C 75 50, 95 50, 105 60 C 115 50, 135 50, 145 60 C 160 55, 165 75, 150 85 C 135 95, 60 95, 45 80 Z" fill="url(#leaf-grad-teal)" opacity="0.9" />
              <path d="M 55 75 C 65 65, 85 65, 95 72 C 105 65, 125 65, 135 75 C 145 75, 140 85, 125 88 C 100 92, 70 92, 55 75 Z" fill="url(#leaf-grad-front)" />

              {/* Edge leaf accent details to break contours */}
              <path d="M 18 55 C 10 54, 8 60, 18 62 Z" fill="url(#leaf-grad-front)" />
              <path d="M 22 42 C 15 38, 18 32, 25 36 Z" fill="url(#leaf-grad-front)" />
              <path d="M 182 55 C 190 54, 192 60, 182 62 Z" fill="url(#leaf-grad-teal)" />
              <path d="M 178 42 C 185 38, 182 32, 175 36 Z" fill="url(#leaf-grad-teal)" />
              <path d="M 75 8 C 72 0, 80 0, 82 8 Z" fill="url(#leaf-grad-front)" />
              <path d="M 125 8 C 122 0, 130 0, 132 8 Z" fill="url(#leaf-grad-teal)" />
              <path d="M 100 -2 C 96 -8, 104 -8, 104 -2 Z" fill="url(#leaf-grad-front)" />
              <path d="M 52 88 C 50 95, 46 95, 48 86" fill="url(#leaf-grad-front)" stroke="#047857" strokeWidth="0.5" />
              <path d="M 148 88 C 150 95, 154 95, 152 86" fill="url(#leaf-grad-teal)" stroke="#0D9488" strokeWidth="0.5" />
              <path d="M 96 92 C 94 100, 90 98, 92 90" fill="url(#leaf-grad-front)" stroke="#047857" strokeWidth="0.5" />
              <path d="M 108 92 C 110 100, 114 98, 112 90" fill="url(#leaf-grad-teal)" stroke="#0D9488" strokeWidth="0.5" />
            </g>

            {/* Subtle Life Effects: Twinkling Sparkles around canopy */}
            <g>
              {/* Sparkle 1 */}
              <g transform="translate(45, 20)">
                <path d="M 0 -4 L 0 4 M -4 0 L 4 0" stroke="#FFF" strokeWidth="0.75" className="animate-twinkle-1" />
              </g>
              {/* Sparkle 2 */}
              <g transform="translate(155, 18)">
                <path d="M 0 -4 L 0 4 M -4 0 L 4 0" stroke="#FDE047" strokeWidth="0.75" className="animate-twinkle-2" />
              </g>
              {/* Sparkle 3 */}
              <g transform="translate(100, 5)">
                <path d="M 0 -4 L 0 4 M -4 0 L 4 0" stroke="#FFF" strokeWidth="0.75" className="animate-twinkle-3" />
              </g>
              {/* Sparkle 4 */}
              <g transform="translate(75, 45)">
                <path d="M 0 -4 L 0 4 M -4 0 L 4 0" stroke="#FDE047" strokeWidth="0.75" className="animate-twinkle-1" style={{ animationDelay: '1s' }} />
              </g>
              {/* Sparkle 5 */}
              <g transform="translate(125, 48)">
                <path d="M 0 -4 L 0 4 M -4 0 L 4 0" stroke="#FFF" strokeWidth="0.75" className="animate-twinkle-2" style={{ animationDelay: '2.5s' }} />
              </g>
            </g>

            {/* Subtle Life Effects: Floating Leaves (Drifting down) */}
            <path d="M 0 0 C -4 -2, -6 -6, -2 -8 C 2 -10, 4 -6, 0 0 Z" fill="#22C55E" className="animate-drift-1" />
            <path d="M 0 0 C -2 -4, -6 -6, -8 -2 C -10 2, -6 4, 0 0 Z" fill="#15803D" className="animate-drift-2" />
            <path d="M 0 0 C -4 -2, -6 -6, -2 -8 C 2 -10, 4 -6, 0 0 Z" fill="#22C55E" className="animate-drift-1" style={{ animationDelay: '4s' }} />
            <path d="M 0 0 C -2 -4, -6 -6, -8 -2 C -10 2, -6 4, 0 0 Z" fill="#15803D" className="animate-drift-2" style={{ animationDelay: '7.5s' }} />

            {/* Subtle Life Effects: Glowing Fireflies */}
            <circle cx="55" cy="115" r="2.2" fill="#A3E635" className="animate-firefly-1" filter="url(#glow-filter)" />
            <circle cx="145" cy="100" r="1.8" fill="#A3E635" className="animate-firefly-2" filter="url(#glow-filter)" />
            <circle cx="85" cy="85" r="2.2" fill="#A3E635" className="animate-firefly-3" filter="url(#glow-filter)" />
            <circle cx="115" cy="125" r="1.8" fill="#A3E635" className="animate-firefly-4" filter="url(#glow-filter)" />
            <circle cx="40" cy="65" r="2.2" fill="#A3E635" className="animate-firefly-1" filter="url(#glow-filter)" style={{ animationDelay: '2.5s' }} />
            <circle cx="160" cy="55" r="2" fill="#A3E635" className="animate-firefly-3" filter="url(#glow-filter)" style={{ animationDelay: '1.2s' }} />
          </g>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="relative w-full max-w-[280px] sm:max-w-[340px] mx-auto aspect-square flex items-center justify-center p-2 rounded-3xl border border-brand-border/40 bg-brand-surface/40 shadow-inner group overflow-hidden select-none">
      
      {/* Floating Sparkle Particles in Greenhouse container */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '1.2s' }} />
        <div className="absolute top-1/3 right-1/3 w-1 h-1 rounded-full bg-emerald-300 animate-pulse" style={{ animationDelay: '0.1s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 rounded-full bg-orange-400 animate-pulse" style={{ animationDelay: '2.1s' }} />
      </div>

      {/* SVG Canvas */}
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full relative z-10 transition duration-500 scale-102 group-hover:scale-105"
      >
        <defs>
          {/* Custom style for micro-interactions */}
          <style>{`
            @keyframes float-particle {
              0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
              50% { transform: translateY(-12px) translateX(6px); opacity: 0.8; }
            }
            .animate-float-1 { animation: float-particle 4s ease-in-out infinite; }
            .animate-float-2 { animation: float-particle 6s ease-in-out infinite 1s; }
            .animate-float-3 { animation: float-particle 5s ease-in-out infinite 2s; }

            .animate-leaf-sway {
              transform-origin: 0px 0px !important;
            }
            svg .origin-bottom {
              transform-origin: 0px 0px !important;
            }

            /* Stage 6: Flourishing Tree Animations */
            @keyframes gentle-sway {
              0%, 100% { transform: rotate(0deg); }
              50% { transform: rotate(1.2deg); }
            }
            .animate-gentle-sway {
              animation: gentle-sway 6s ease-in-out infinite;
              transform-origin: 100px 155px;
            }

            @keyframes drift-leaf-1 {
              0% { transform: translate(110px, 20px) rotate(0deg); opacity: 0; }
              10% { opacity: 0.8; }
              90% { opacity: 0.8; }
              100% { transform: translate(65px, 140px) rotate(270deg); opacity: 0; }
            }
            @keyframes drift-leaf-2 {
              0% { transform: translate(75px, 35px) rotate(0deg); opacity: 0; }
              10% { opacity: 0.7; }
              90% { opacity: 0.7; }
              100% { transform: translate(125px, 145px) rotate(-180deg); opacity: 0; }
            }
            .animate-drift-1 { animation: drift-leaf-1 9s linear infinite; }
            .animate-drift-2 { animation: drift-leaf-2 11s linear infinite; }

            @keyframes blink-firefly {
              0%, 100% { opacity: 0; transform: translate(0px, 0px) scale(0.7); }
              50% { opacity: 0.95; transform: translate(3px, -5px) scale(1.1); }
            }
            .animate-firefly-1 { animation: blink-firefly 5s ease-in-out infinite; }
            .animate-firefly-2 { animation: blink-firefly 7s ease-in-out infinite 2s; }
            .animate-firefly-3 { animation: blink-firefly 6s ease-in-out infinite 3.5s; }
            .animate-firefly-4 { animation: blink-firefly 8s ease-in-out infinite 1s; }

            @keyframes twinkle {
              0%, 100% { opacity: 0.2; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.25); }
            }
            .animate-twinkle-1 { animation: twinkle 3s ease-in-out infinite; transform-origin: center center; }
            .animate-twinkle-2 { animation: twinkle 4s ease-in-out infinite 1.5s; transform-origin: center center; }
            .animate-twinkle-3 { animation: twinkle 3.5s ease-in-out infinite 2.2s; transform-origin: center center; }
          `}</style>

          {/* Radial pedestal shadow */}
          <radialGradient id="pedestal-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 0, 0, 0.7)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>

          {/* Rich Soil Gradients */}
          <linearGradient id="soil-grad-1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4A2F1B" />
            <stop offset="100%" stopColor="#1F1007" />
          </linearGradient>
          <linearGradient id="soil-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3D2411" />
            <stop offset="100%" stopColor="#150A03" />
          </linearGradient>

          {/* Split Seed Shell Gradient */}
          <linearGradient id="seed-shell-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5C3A21" />
            <stop offset="100%" stopColor="#2D180B" />
          </linearGradient>

          {/* Stem & Branch Gradient */}
          <linearGradient id="stem-grad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="60%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>

          {/* Leaf Gradients */}
          <linearGradient id="leaf-grad-front" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="60%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>
          <linearGradient id="leaf-grad-back" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#064E3B" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <linearGradient id="leaf-grad-teal" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D9488" />
            <stop offset="60%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#99F6E4" />
          </linearGradient>

          {/* Trunk & Bark Gradient */}
          <linearGradient id="trunk-grad" x1="0%" y1="100%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#451A03" />
            <stop offset="50%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#5C2807" />
          </linearGradient>

          {/* Root Gradient */}
          <linearGradient id="root-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#371802" />
            <stop offset="100%" stopColor="#1A0A00" />
          </linearGradient>

          {/* Flower Petal Gradients */}
          <linearGradient id="flower-grad-pink" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#BE185D" />
            <stop offset="60%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#FBCFE8" />
          </linearGradient>
          <linearGradient id="flower-grad-purple" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="60%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#DDD6FE" />
          </linearGradient>

          {/* Radial ambient glow & halos */}
          <radialGradient id="glow-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.35)" />
            <stop offset="60%" stopColor="rgba(52, 211, 153, 0.1)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
          <radialGradient id="halo-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.25)" />
            <stop offset="60%" stopColor="rgba(16, 185, 129, 0.08)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>

          {/* SVG Shadow and Glow filters */}
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2.5" stdDeviation="1.8" floodColor="#000" floodOpacity="0.18" />
          </filter>
          <filter id="glow-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Shadow under pedestal */}
        <ellipse cx="100" cy="165" rx="76" ry="12" fill="url(#pedestal-shadow)" />

        {/* Dynamic Plant Render */}
        {renderSVGPlant()}
      </svg>
    </div>
  );
}
