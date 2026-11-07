// Describes what the admin can edit. Types: text | area | media | strings | list | group
const text = (key, label, extra) => ({ key, label, type: 'text', ...extra })
const area = (key, label, extra) => ({ key, label, type: 'area', ...extra })
const media = (key, label, only) => ({ key, label, type: 'media', only })
const strings = (key, label, hint) => ({ key, label, type: 'strings', hint })
const list = (key, label, fields, extra) => ({ key, label, type: 'list', fields, ...extra })
const group = (key, label, fields) => ({ key, label, type: 'group', fields })

const titleText = [text('title', 'Title'), area('text', 'Text')]

export const sections = [
  {
    id: 'hero', label: 'Hero', field: group('hero', 'Hero', [
      text('eyebrow', 'Small line above the headline'),
      group('intro', 'Intro paragraph', [
        text('name', 'Your name (bold)'),
        area('before', 'Text before the highlight'),
        area('highlight', 'Highlighted phrase (bold)'),
        area('after', 'Text after the highlight'),
      ]),
      strings('tags', 'Tag pills'),
      media('media', 'Hero video', 'video'),
      text('videoLabel', 'Label on the video'),
      list('chips', 'Floating stat chips', [text('label', 'Label'), text('value', 'Value'), text('unit', 'Unit')], { fixed: true, item: (c) => `${c.label} — ${c.value} ${c.unit}`, hint: 'The first chip counts up when its value is a number.' }),
    ]),
  },
  { id: 'marquee', label: 'Ticker', field: strings('marquee', 'Scrolling ticker items') },
  {
    id: 'disciplines', label: 'Disciplines',
    field: list('disciplines', 'Disciplines', [text('title', 'Title'), area('text', 'Description'), media('media', 'Media')], { item: (d) => d.title }),
  },
  {
    id: 'lab', label: 'Numbers', field: group('lab', 'The Numbers', [
      text('bodyweight', 'Bodyweight (kg) — used for the × bodyweight ratio'),
      list('lifts', 'Barbell lifts (plates are drawn from the kg)', [text('tab', 'Tab name'), text('name', 'Full name'), text('kg', 'Weight (kg)')], { item: (l) => `${l.tab} — ${l.kg} kg` }),
      list('cards', 'Achievement cards', [
        text('label', 'Heading'),
        list('lines', 'Lines', [text('title', 'Event'), text('value', 'Result')]),
        text('note', 'Note'),
      ], { item: (c) => c.label }),
    ]),
  },
  {
    id: 'gallery', label: 'Gallery',
    field: list('gallery', 'Gallery items (in order)', [text('tag', 'Tag'), text('cap', 'Caption'), media('media', 'Photo or video')], { item: (g) => `${g.tag} — ${g.cap}` }),
  },
  {
    id: 'coaching', label: 'Coaching', field: group('coaching', 'Coaching', [
      list('cards', 'Coaching cards', titleText, { item: (c) => c.title }),
      text('certTitle', 'Certification title'),
      list('cert', 'Certification topics', titleText, { item: (c) => c.title }),
    ]),
  },
  {
    id: 'about', label: 'About', field: group('about', 'About', [
      media('media', 'Portrait', 'image'),
      text('badge', 'Badge on the photo'),
      area('text', 'Bio'),
      list('facts', 'Quick facts', [text('title', 'Label'), text('text', 'Value')], { item: (f) => f.title }),
    ]),
  },
  {
    id: 'contact', label: 'Contact', field: group('contact', 'Contact', [
      text('instagramUrl', 'Instagram link'),
      text('instagramHandle', 'Instagram handle (shown)'),
      text('email', 'Email'),
      text('phone', 'Phone, international (e.g. +919206559141)'),
      text('phoneDisplay', 'Phone (shown)'),
      text('whatsapp', 'WhatsApp number, digits only, with country code'),
      strings('goals', 'Goal options in the form'),
    ]),
  },
  {
    id: 'brand', label: 'Brand & footer', field: group('', 'Brand & footer', [
      group('brand', 'Header brand', [text('name', 'Name'), text('initials', 'Badge letters')]),
      group('footer', 'Footer', [text('legalName', 'Legal name'), text('tagline', 'Tagline')]),
    ]),
  },
]
