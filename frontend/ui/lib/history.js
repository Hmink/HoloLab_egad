// History data in one shape, whatever the source. Today the only source is this browser
// (localStorage "hololab-saved-v38" + EGAD turns still in page memory). When the session backend of
// API v3.1 exists, a server source returning the same shape is all the History page needs.
import { savedLessonId, savedStatus } from './search.js';

/**
 * @returns {{source:'browser', sessions: Array<{key, title, lessonId, lesson, date, status, raw}>,
 *            live: Array<{lessonId, lesson, turns}>}}
 * `live` = EGAD answers of the current page only (not stored; gone after a reload).
 */
export function browserHistory({ saved = [], lessons = [], turns = [] }) {
  const byId = new Map(lessons.map((l) => [l.id, l]));
  return {
    source: 'browser',
    sessions: saved.map((s, i) => {
      const lessonId = savedLessonId(s);
      return { key: `${i}-${s.date}`, title: s.name, lessonId, lesson: byId.get(lessonId) || null, date: s.date, status: savedStatus(s), raw: s };
    }),
    live: turns.map((t) => ({ ...t, lesson: byId.get(t.lessonId) || null })),
  };
}
