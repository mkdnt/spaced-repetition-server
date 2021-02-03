const express = require("express");
const LanguageService = require("./language-service");
const { requireAuth } = require("../middleware/jwt-auth");
const parser = express.json();
const { _Node, array } = require("../linked/linked");

const languageRouter = express.Router();

languageRouter.use(requireAuth).use(async (req, res, next) => {
  try {
    const language = await LanguageService.getUsersLanguage(
      req.app.get("db"),
      req.user.id
    );

    if (!language)
      return res.status(404).json({
        error: `You don't have any languages`,
      });

    req.language = language;
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/", async (req, res, next) => {
  try {
    const words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );

    res.json({
      language: req.language,
      words,
    });
    console.log(words)
    next();
  } catch (error) {
    next(error);
  }
});

languageRouter.get("/head", async (req, res, next) => {
  try {
    const [upcoming] = await LanguageService.getNextWord(
      req.app.get("db"),
      req.language.id
    );
    res.json({
      nextWord: upcoming.original,
      totalScore: req.language.total_score,
      wordCorrectCount: upcoming.correct_count,
      wordIncorrectCount: upcoming.incorrect_count,
    });
    next();
  } catch (e) {
    next(e);
  }
});

languageRouter.post("/guess", parser, async (req, res, next) => {
  const guess = req.body.guess.toLowerCase().trim();
  console.log('this is the guess', req.body)

  if (!guess) {
    res.status(400).json({ error: `Missing 'guess' in request body` });
  }

  try {
    let words = await LanguageService.getLanguageWords(
      req.app.get("db"),
      req.language.id
    );
    const [{ head }] = await LanguageService.getLangHead(
      req.app.get("db"),
      req.language.id
    );
    let list = LanguageService.createLL(words, head);
    let [nextWord] = await LanguageService.compare(
      req.app.get("db"),
      req.language.id
    );

    if (nextWord.translation.toLowerCase() === guess) {
      let memValue = list.head.value.memory_value * 2;
      list.head.value.memory_value = memValue
      list.head.value.correct_count++;

      let current = list.head;
      let less = memValue;
      while (less > 0 && current.next !== null) {
        current = current.next;
        less--;
      }

      let tempNode = new _Node(list.head.value);

      if (current.next === null) {
        tempNode.next = current.next;
        current.next = tempNode;
        list.head = list.head.next;
        current.value.next = tempNode.value.id;
        tempNode.value.next = null;
      } else {
        tempNode.next = current.next;
        current.next = tempNode;
        list.head = list.head.next;
        current.value.next = tempNode.value.id;
        tempNode.value.next = tempNode.next.value.id;
      }
      req.language.total_score++;

      await LanguageService.updateTable(
        req.app.get("db"),
        array(list),
        req.language.id,
        req.language.total_score
      );
      res.json({
        nextWord: list.head.value.original,
        translation: list.head.value.translation,
        totalScore: req.language.total_score,
        wordCorrectCount: list.head.value.correct_count,
        wordIncorrectCount: list.head.value.incorrect_count,
        answer: tempNode.value.translation,
        isCorrect: true,
      });
    } else {
      list.head.value.memory_value = 1;
      list.head.value.incorrect_count++;

      let current = list.head;
      let less = 1;
      while (less > 0) {
        current = current.next;
        less--;
      }
      let tempNode = new _Node(list.head.value);
      tempNode.next = current.next;
      current.next = tempNode;
      list.head = list.head.next;
      current.value.next = tempNode.value.id;
      tempNode.value.next = tempNode.next.value.id;

      await LanguageService.updateTable(
        req.app.get("db"),
        array(list),
        req.language.id,
        req.language.total_score
      );
      res.json({
        nextWord: list.head.value.original,
        totalScore: req.language.total_score,
        wordCorrectCount: list.head.value.correct_count,
        wordIncorrectCount: list.head.value.incorrect_count,
        answer: tempNode.value.translation,
        isCorrect: false,
      });
    }
    next();
  } catch (e) {
    next(e);
  }
});

module.exports = languageRouter;