/* ============================================================
   CONTENIDO EDITABLE — Testimonios y Galería
   Este es el ÚNICO archivo que hay que tocar para añadir contenido.
   EDITABLE CONTENT — Testimonials and Gallery
   This is the ONLY file you need to touch to add content.
   ============================================================ */

/* --- TESTIMONIOS / TESTIMONIALS ---
   Para añadir uno: copia un bloque { ... }, pégalo antes del ] final y edita.
   Los campos ...En son el inglés; si falta uno, se muestra el español.
   To add one: copy a { ... } block, paste it before the final ] and edit.
   The ...En fields are English; if one is missing, Spanish is shown.

   Plantilla / Template:
   { quote: "Testimonio en español…", quoteEn: "Testimonial in English…",
     name: "Nombre Apellido", role: "Madre de estudiante de X grado", roleEn: "Mother of an Xth-grade student" },
*/
const TESTIMONIALS = [
  { quote: "Texto de ejemplo: Mi hija mejoró muchísimo en matemáticas desde que empezó las tutorías. Las maestras son pacientes y dedicadas.",
    quoteEn: "Example text: My daughter improved tremendously in math since starting tutoring. The teachers are patient and dedicated.",
    name: "María Rivera", role: "Madre de estudiante de 4to grado", roleEn: "Mother of a 4th-grade student" },
  { quote: "Texto de ejemplo: El programa de homeschooling nos dio la flexibilidad que nuestra familia necesitaba, sin sacrificar calidad educativa.",
    quoteEn: "Example text: The homeschooling program gave our family the flexibility we needed without sacrificing educational quality.",
    name: "José Santiago", role: "Padre de estudiante de 7mo grado", roleEn: "Father of a 7th-grade student" },
  { quote: "Texto de ejemplo: Un ambiente seguro y familiar. Mi hijo va contento a sus tutorías y sus notas lo demuestran.",
    quoteEn: "Example text: A safe, family-like environment. My son is happy to attend his tutoring sessions and his grades show it.",
    name: "Carmen Ortiz", role: "Madre de estudiante de 2do grado", roleEn: "Mother of a 2nd-grade student" },
  { quote: "Texto de ejemplo: La comunicación con los padres es excelente. Siempre sabemos cómo va progresando nuestra hija.",
    quoteEn: "Example text: Communication with parents is excellent. We always know how our daughter is progressing.",
    name: "Luis Meléndez", role: "Padre de estudiante de 10mo grado", roleEn: "Father of a 10th-grade student" },
  { quote: "Texto de ejemplo: Después de un año en CIFE, mi hijo pasó de frustrarse con la lectura a disfrutarla.",
    quoteEn: "Example text: After a year at CIFE, my son went from being frustrated with reading to enjoying it.",
    name: "Ana Vázquez", role: "Madre de estudiante de kindergarten", roleEn: "Mother of a kindergarten student" },
];

/* --- GALERÍA / GALLERY ---
   Para añadir una foto: guarda la imagen en assets/gallery/ y copia un bloque { ... } aquí.
   Los campos ...En son el inglés; si falta uno, se muestra el español.
   To add a photo: save the image in assets/gallery/ and copy a { ... } block here.
   The ...En fields are English; if one is missing, Spanish is shown.

   Plantilla / Template:
   { src: "assets/gallery/mi-foto.jpg",
     alt: "Descripción para accesibilidad", altEn: "Accessibility description",
     caption: "Título visible de la foto", captionEn: "Visible photo caption" },
*/
const GALLERY = [
  { src: "assets/gallery/foto-01.svg",
    alt: "Foto de ejemplo 1", altEn: "Example photo 1",
    caption: "Texto de ejemplo: actividad educativa", captionEn: "Example text: educational activity" },
  { src: "assets/gallery/foto-02.svg",
    alt: "Foto de ejemplo 2", altEn: "Example photo 2",
    caption: "Texto de ejemplo: sesión de tutoría", captionEn: "Example text: tutoring session" },
  { src: "assets/gallery/foto-03.svg",
    alt: "Foto de ejemplo 3", altEn: "Example photo 3",
    caption: "Texto de ejemplo: nuestras facilidades", captionEn: "Example text: our facilities" },
  { src: "assets/gallery/foto-04.svg",
    alt: "Foto de ejemplo 4", altEn: "Example photo 4",
    caption: "Texto de ejemplo: evento familiar", captionEn: "Example text: family event" },
  { src: "assets/gallery/foto-05.svg",
    alt: "Foto de ejemplo 5", altEn: "Example photo 5",
    caption: "Texto de ejemplo: proyecto estudiantil", captionEn: "Example text: student project" },
  { src: "assets/gallery/foto-06.svg",
    alt: "Foto de ejemplo 6", altEn: "Example photo 6",
    caption: "Texto de ejemplo: celebración de logros", captionEn: "Example text: celebrating achievements" },
];
