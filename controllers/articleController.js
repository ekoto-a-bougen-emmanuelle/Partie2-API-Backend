const Article = require('../models/articleModel');

const validateCreateArticle = ({ titre, contenu, auteur, date, categorie }) => {
  if (!titre || titre.trim() === '') return 'Le titre est obligatoire';
  if (!contenu || contenu.trim() === '') return 'Le contenu est obligatoire';
  if (!auteur || auteur.trim() === '') return 'L’auteur est obligatoire';
  if (!date || date.trim() === '') return 'La date est obligatoire';
  if (!categorie || categorie.trim() === '') return 'La catégorie est obligatoire';
  return null;
};

const validateUpdateArticle = ({ titre, contenu, categorie }) => {
  if (!titre || titre.trim() === '') return 'Le titre est obligatoire';
  if (!contenu || contenu.trim() === '') return 'Le contenu est obligatoire';
  if (!categorie || categorie.trim() === '') return 'La catégorie est obligatoire';
  return null;
};

exports.createArticle = (req, res) => {
  const { titre, contenu, auteur, date, categorie, tags } = req.body;

  const error = validateCreateArticle({ titre, contenu, auteur, date, categorie });
  if (error) {
    return res.status(400).json({ message: error });
  }

  const articleData = {
    titre: titre.trim(),
    contenu: contenu.trim(),
    auteur: auteur.trim(),
    date: date.trim(),
    categorie: categorie.trim(),
    tags: tags ? tags.trim() : ''
  };

  Article.create(articleData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la création de l’article' });
    }

    res.status(201).json({
      message: 'Article créé avec succès',
      id: result.id
    });
  });
};

exports.getAllArticles = (req, res) => {
  const filters = {
    categorie: req.query.categorie,
    auteur: req.query.auteur,
    date: req.query.date
  };

  Article.getAll(filters, (err, articles) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
    }

    res.status(200).json(articles);
  });
};

exports.getArticleById = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID invalide' });
  }

  Article.getById(id, (err, article) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération de l’article' });
    }

    if (!article) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json(article);
  });
};

exports.updateArticle = (req, res) => {
  const id = parseInt(req.params.id);
  const { titre, contenu, categorie, tags } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID invalide' });
  }

  const error = validateUpdateArticle({ titre, contenu, categorie });
  if (error) {
    return res.status(400).json({ message: error });
  }

  const articleData = {
    titre: titre.trim(),
    contenu: contenu.trim(),
    categorie: categorie.trim(),
    tags: tags ? tags.trim() : ''
  };

  Article.update(id, articleData, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de l’article' });
    }

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json({ message: 'Article mis à jour avec succès' });
  });
};

exports.deleteArticle = (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'ID invalide' });
  }

  Article.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la suppression de l’article' });
    }

    if (result.changes === 0) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.status(200).json({ message: 'Article supprimé avec succès' });
  });
};

exports.searchArticles = (req, res) => {
  const query = req.query.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Le paramètre query est obligatoire' });
  }

  Article.search(query.trim(), (err, articles) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la recherche des articles' });
    }

    res.status(200).json(articles);
  });
};
