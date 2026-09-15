# Drawing SVG that doesn't look like clipart

The default failure mode when a language model writes SVG is instantly
recognisable: a flat saturated shape centred on white, black outlines
everywhere, primary colours straight out of the box. It reads as a diagram, not
a picture. Everything below is aimed at that one problem.

## Palette first, shapes second

Pick five to seven colours *before* drawing anything, and use only those. A
constrained palette is the single biggest difference between amateur and
considered work — it forces relationships between elements instead of letting
each shape pick its own colour.

Build it from a light source rather than from a colour wheel. Decide where the
light comes from and what colour it is, then everything follows: lit surfaces
lean toward the light's hue, shadows lean toward its complement. Warm sunlight
means blue-violet shadows, never grey ones. Grey shadows are what make an
illustration look dead.

Avoid pure `#000` and pure `#fff`. Near-black with a hue in it (`#12161f`,
`#1b1410`) and warm off-white (`#f5f0e6`) read as *chosen*; pure black and white
read as *default*. Push saturation down in the darks and up in the midtones.

A workable starting structure, adapted to the mood:

```
deep     #1b2a41   darkest accent, used sparingly for weight
base     #2e4057   the dominant mass
mid      #6b8f9e   the workhorse midtone
light    #d9c6a3   lit surfaces
accent   #e07a5f   one warm note, used on <10% of the canvas
```

One accent colour, used on very little of the canvas, does more than three
competing accents. If everything is emphasised, nothing is.

## Compose in layers, back to front

Write the SVG in the order a painter works, each layer in its own `<g>` with a
comment. This keeps the file editable and forces you to actually think about
depth instead of scattering objects:

1. **Ground** — full-bleed background. Almost never a flat fill; a subtle
   vertical `linearGradient` or a large soft `radialGradient` glow already
   reads better.
2. **Far** — horizon, distant hills, skyline. Low contrast, desaturated,
   shifted toward the sky colour.
3. **Mid** — the setting the subject sits in.
4. **Subject** — the thing the picture is about. Highest contrast and the most
   detail on the canvas.
5. **Near** — framing elements in front: foliage edges, a windowsill, a blurred
   railing. Darker and larger than feels natural.
6. **Atmosphere** — light shafts, haze, grain, vignette, applied over everything.

Atmospheric perspective is doing most of the work in steps 2 and 5. Distant
things lose contrast and take on the colour of the air between; near things go
dark and lose detail. Applying that consistently creates depth more convincingly
than any amount of added detail.

Place the subject off-centre. Thirds, or a deliberate edge-weighted composition
— dead centre with symmetrical margins is the arrangement that reads as
"generated".

## Techniques that carry the most weight

**Grain.** A turbulence overlay at low opacity is the highest-return effect
available. It breaks up flat vector fills into something that looks printed:

```xml
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
  <feColorMatrix type="saturate" values="0"/>
</filter>
<rect width="100%" height="100%" filter="url(#grain)" opacity="0.10"
      style="mix-blend-mode:overlay" pointer-events="none"/>
```

Keep it between `0.06` and `0.14`. Above that it turns to television static.

**Gradients on everything that would catch light.** A sky, a sphere, a floor
plane. Two stops is usually enough; the point is to avoid the flat fill, not to
build a rainbow.

**Soft shadows via `feGaussianBlur`**, not hard offset copies. An object needs a
contact shadow — darkest and tightest right where it meets the ground, spreading
and fading outward. Without contact shadow, objects float.

**Vignette** — a large `radialGradient` from transparent centre to a dark edge,
at 15–30% opacity. It pulls the eye inward and covers a multitude of
compositional sins.

**Line weight, if you use outlines at all.** Vary it — thicker on the shadow
side, thinner or absent on the lit side. Uniform stroke on every shape is the
clipart signature. Often the better move is no outline: let colour boundaries do
the work, and reserve stroke for deliberate accents.

## Canvas and coordinates

Give the root `<svg>` a `viewBox` and *no* `width`/`height` attributes — the
renderer sets the pixel size, so the same file serves any output resolution.

Pick a viewBox that matches the intended use, and work in round numbers:

| Use | viewBox |
|---|---|
| Icon / app mark | `0 0 512 512` |
| Social square | `0 0 1200 1200` |
| Wide banner / OG image | `0 0 1200 630` |
| Poster (A-series ratio) | `0 0 1240 1754` |
| Desktop wallpaper | `0 0 1920 1080` |

Define every gradient and filter once in `<defs>` and reference them. Repeating
a gradient definition inline for each shape is how a file becomes unmaintainable
at revision time.

## Text

Latin text is safe with `DejaVu Sans`, `Liberation Sans` or `FreeSans` — all
installed and all open-licensed.

**Hangul and CJK are the weak spot here.** The only fonts on this machine with
Hangul coverage are `WenQuanYi Zen Hei` and `Unifont`, and neither is a display
face — Unifont in particular is a bitmap font and looks broken at large sizes.
So:

- Prefer designs that carry meaning without text, or with short Latin text.
- When Korean text is genuinely required, set
  `font-family="WenQuanYi Zen Hei, sans-serif"`, keep it at modest size, and
  **look at the rendered PNG** to confirm every glyph actually appeared. Missing
  glyphs render as blank boxes and are easy to miss if you only read the SVG.
- For a large Korean headline, draw the letterforms as paths instead, or tell
  the user plainly that the headline will look better added in a design tool.
  Shipping a heading in a bitmap fallback font is worse than saying so.

Centre text with `text-anchor="middle"` rather than guessing the x-offset, and
never rely on `dominant-baseline` alone for vertical centring — support varies.
Position from the baseline.

## Look at the result

Render the PNG and then actually read the image file back. This matters more
than any single technique: SVG that parses cleanly can still render as a blank
canvas, a clipped subject, an element buried under a filter, or a shape whose
`fill` never applied. None of that is visible from reading the markup.

Check specifically for the failure modes that survive a clean parse:

- Blank or near-blank output (a filter region collapsed, or a mis-sized viewBox)
- The subject clipped at an edge, or floating without contact shadow
- Text overflowing its container or rendering as empty boxes
- Grain so strong it has eaten the artwork
- Everything sitting at the same depth — the layer plan didn't survive contact
- **Parts that don't meet.** A hand that stops short of the thing it holds, an
  umbrella shaft passing through a head, a sign hovering off the wall it belongs
  to, legs ending above the ground. Each element is placed by its own
  coordinates, so nothing enforces that things touch — and a single unconnected
  joint is the detail that makes an otherwise good picture read as fake. Trace
  each contact point and check the numbers actually overlap.
- **Symmetry that crept back in.** A subject at dead centre with even margins is
  easy to plan against and easy to produce anyway, because centring is what
  happens when you place a large shape by arithmetic. If the composition came
  out symmetrical, shifting the main group with a single `transform="translate"`
  and rebalancing with a foreground element costs one edit and changes the
  picture completely.

Then revise and re-render. One revision pass on a rendered image beats any
amount of care spent writing SVG blind.
