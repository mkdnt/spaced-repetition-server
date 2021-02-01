const { LinkedList, array } = require("../linked/linked");

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from("language")
      .select(
        "language.id",
        "language.name",
        "language.user_id",
        "language.head",
        "language.total_score"
      )
      .where("language.user_id", user_id)
      .first();
  },

  getLanguageWords(db, language_id) {
    return db
      .from("word")
      .select(
        "id",
        "language_id",
        "original",
        "translation",
        "next",
        "memory_value",
        "correct_count",
        "incorrect_count"
      )
      .where({ language_id });
  },

  getNextWord(db, language_id) {
    return db
      .from("word")
      .join("language", "word.id", "=", "language.head")
      .select("original", "language_id", "correct_count", "incorrect_count")
      .where({ language_id });
  },

  getLangHead(db, language_id) {
    return db
      .from("language")
      .join("word", "word.language_id", "=", "language.id")
      .select("head")
      .groupBy("head")
      .where({ language_id });
  },

  createLL(words, head) {
    console.log('Begin words', words)
    const hObject = words.find((word) => word.id === head);
    const hIndex = words.indexOf(hObject);
    const hNode = words.splice(hIndex, 1);
    const list = new LinkedList();
    list.insertLast(hNode[0]);

    let nextId = hNode[0].next;
    let current = words.find((word) => word.id === nextId);
    list.insertLast(current);
    nextId = current.next;
    current = words.find((word) => word.id === nextId);

    while (current !== null) {
      console.log('This is the current', current)
      list.insertLast(current);
      nextId = current.next;
      if (nextId === null) {
        current = null;
      } else {
        current = words.find((word) => word.id === nextId);
      }
    }
    return list;
  },

  compare(db, language_id) {
    return db
      .from("word")
      .join("language", "word.id", "=", "language.head")
      .select("*")
      .where({ language_id });
  },

  updateTable(db, words, language_id, total_score) {
    return db.transaction(async (trx) => {
      return Promise.all([
        trx("language").where({ id: language_id }).update({
          total_score,
          head: words[0].id,
        }),
        ...words.map((word, index) => {
          if (index + 1 >= words.length) {
            word.next = null;
          } else {
            word.next = words[index + 1].id;
          }
          return trx("word")
            .where({ id: word.id })
            .update({
              ...word,
            });
        }),
      ]);
    });
  },
};

module.exports = LanguageService;