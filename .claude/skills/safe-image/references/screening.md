# Screening a request for IP risk

## Why this step exists

The artwork this skill produces is drawn from scratch — every path, gradient and
colour stop is authored in the SVG. There is no source image being sampled, so
the usual worry about a generative model regurgitating a training example does
not apply. Copyright risk can only enter through **what you are asked to
depict**. A hand-drawn Pikachu is still an infringing Pikachu.

So the screen is narrow and specific: it looks at the *subject matter*, not the
technique. Most requests pass untouched. Do not treat this as a gate to
interrogate the user through — read the request, and act only if something in
the list below is actually named.

## What to look for

**Named fictional characters.** Pikachu, Mickey Mouse, Mario, Elsa, Doraemon,
Pororo, Iron Man. Protected as artistic works, often trademarked too. This
covers the character as a design, so "a yellow electric mouse with a lightning
tail" is still Pikachu if that is clearly what is meant.

**Logos, wordmarks and trade dress.** The Nike swoosh, the Apple silhouette, the
Starbucks siren, a specific football club's crest. These are trademarks; the
risk is confusion and dilution, and it does not depend on pixel-level copying.

**Identifiable real people.** Celebrities, politicians, athletes, the user's
neighbour. This is a publicity/likeness and privacy question rather than
copyright, but it is the same answer: don't render a recognisable specific
person.

**Signature styles of living or recently-dead artists.** "지브리풍", "Studio
Ghibli style", "in the style of Greg Rutkowski", "Banksy-style stencil".
Be accurate about why this one is on the list: **artistic style as such is
generally not copyrightable.** The problem is practical — a named-style prompt
pulls the composition toward reproducing that studio's actual protected
character designs and specific works, and using a studio's name to describe your
output invites a trademark and passing-off complaint. Describe the visual
qualities instead and the risk disappears.

**Protected product and architectural designs.** A specific phone model, a
current car model, a named designer chair, a distinctive recent building.
Design rights and trade dress can attach. Generic versions are fine.

**Reproducing a specific existing artwork or photograph.** "Redraw this album
cover", "copy this photo I found". Recreating a particular protected work in a
new medium is still a derivative work.

## What is clearly fine — do not flag these

- **Public domain works and their creators' styles.** Van Gogh, Hokusai,
  Mucha, Klimt, Vermeer. Long-expired copyright. "반 고흐 별이 빛나는 밤 스타일"
  is safe to honour directly.
- **Genres, movements and eras.** Art deco, bauhaus, ukiyo-e, brutalist,
  vaporwave, mid-century modern, cyberpunk, watercolour, isometric, low-poly.
  None of these belong to anyone.
- **Generic subjects, however specific the description.** A tabby cat asleep on
  a radiator, a ramen shop at night in the rain, a mountain range at dawn.
- **The user's own material.** If they describe their own logo, their own
  product, their own face — it is theirs. Draw it.
- **Nominative reference in text.** Writing the word "Python" on a poster about
  Python is not trademark infringement.

## How to handle a hit

Do not stop and ask permission, and do not refuse. The user wants an image; the
useful move is to **substitute the generic equivalent, draw it, and say plainly
what you changed.** One sentence, no lecture, then get on with the work.

The substitution should preserve whatever the user actually wanted. Someone who
asks for a Ghibli-style village wants warmth, soft light and hand-painted
texture — give them that. Someone who asks for a Pikachu sticker wants a round,
cheerful, yellow mascot — give them an original one.

| Asked for | Draw instead | Tell them |
|---|---|---|
| 지브리풍 시골 마을 | Soft watercolour palette, hazy light, hand-painted skies, rolling farmland | "스튜디오 이름 대신 화풍 자체(수채 질감·부드러운 광원)로 표현했습니다" |
| 피카츄 스티커 | An original round yellow mascot — different ears, face and markings | "피카츄는 저작권이 있어서, 같은 느낌의 오리지널 캐릭터로 그렸습니다" |
| 나이키 로고가 박힌 운동화 | The same shoe with an original mark, or no mark | "상표라서 로고는 빼고 오리지널 마크를 넣었습니다" |
| BTS 멤버 일러스트 | A stylised figure that is nobody in particular | "실존 인물 대신 특정되지 않는 인물로 그렸습니다" |
| 아이폰 목업 | A generic slab smartphone — plain bezels, no branded details | "특정 기종 대신 일반적인 스마트폰 형태로 그렸습니다" |

If the substitution would gut the request — the user specifically wants *that*
character for fan art and nothing else will do — say so directly and offer the
original-mascot route. Don't pretend the generic version is what they asked for.

## Fonts

Typefaces are licensed separately from images, but this only matters for what
gets *distributed*. Rendering text to a PNG with a font installed on this
machine produces an image, not a redistributable copy of the font, so the output
is fine to use. The fonts available here are open-licensed anyway (DejaVu,
Liberation, FreeSans, WenQuanYi).

Two practical notes rather than legal ones:

- Never reproduce a **logotype** — a brand's specific lettering is protected as
  a mark regardless of which font you set it in.
- Hangul and CJK render only through `WenQuanYi Zen Hei` or `Unifont` here, and
  neither is a display face. See `craft.md` for what to do about it.
