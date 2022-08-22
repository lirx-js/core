# Why @lirx ?

Je suis front-end developer, et j'ai fait un constat simple:
[//]: # (I'm a front-end developer, and I made a simple observation:)

Javascript fonctionne avec beaucoup de resources asynchrones, mais il n'est pas si simple de toutes les gérer, les chainer
et les libérer une fois que nous n'en n'avons plus besoin.

J'ai vu et fixé une quantité astronomique de bugs liés à un mauvais usage de code asynchrone:

- ordre de résolution non géré proprement: fréquemment, des développeurs assument qu'une tache asynchrone va se terminer ou s'exécuter plus vite qu'une autre.
Le code résultant bug si l'inverse se produit, où l'application se retrouve dans un état inconsistant.
Par exemple:

```ts
function main() {
  let content: string;
  
  getContent()
    .then((data: string) => {
      content = data;
    });
  
  window.onclick = () => { 
    document.body.innerText = content;
    // what if the user click before 'getContent()' finished ? => source of BUG
  };
}
```

- erreurs presque jamais gérées: très souvent, le `catch` des promises est oublié, ainsi que toutes erreurs présentes dans des `setInterval` ou autres.
Ne pas traiter ces erreurs résulte en une expérience utilisateur dégradée, car l'application risque de cesser de fonctionner brutalement et sans donner d'information à l'utilisateur.

- les taches asynchrones sont rarement stoppées:
il est très fréquent de trouver des composants qui démarrent un `setTimeout`, `addEventListener` ou un `fetch`, et qui ne sont jamais détruits lorsque le composant n'est plus utilisé.

Si, les taches asynchrones ne sont pas correctement gérées, cela conduit inévitablement vers un état de l'application du plus en plus inconsistent
ainsi que de nombreux memory-leaks, qui viennent entamer petit à petit l'expérience utilisateur.

Pour répondre à cette problématique, il existe une façon de faire qui s'appelle `Reactive Programming`.
Malheureusement, elle est très peu connue, probablement due à sa courbe d'apprentissage initiale élevée.


Coté Javascript, nous avons [RxJS](https://rxjs.dev/) qui permet de travailler en RP, mais je n'étais pas du tout satisfait:

- rxjs est mal documenté: il est vraiment difficile pour un débutant de rentrer dans le monde des Observables et certaines documentations sont inexistantes, voire obsolètes.
- rxjs est lourd: bien que la librairie ait fait et fasse beaucoup d'efforts pour réduire sa taille, le fait même qu'elle se serve de classes,
empêche de nombreuses optimizations, aussi bien pour le bundler (tree-shacking limité, minification des méthodes impossible, etc.)
que pour le moteur JS.

Je me suis donc lancé dans la conception de ma propre librairie, et après de [nombreuses itérations](https://www.npmjs.com/package/@lifaon/observables), voilà `@lirx/core`.
C'est simplement la librairie [la plus rapide et la plus compacte](./performances.md) pour travailler en RP.
J'ai alors choisi comme nom `LiRX` prononcé `lyrics`  et qui est un acronyme de `Light Reactive X`.

---

De plus, si on regarde l'architecture des frameworks front-end actuels (React, Angular, Vue),
on peut facilement se rendre compte qu'ils sacrifient une bonne partie des performances pour plus de lisibilité et simplicité.

Par exemple, si un état infime change dans un composant plutôt haut dans l'arbre du DOM (ici `date`):

`app.component.html`:

```html
{{ date }}
<child-a></child-a>
<child-b></child-b>
```


- avec Angular, toutes les propriétés du composant sont réévalués, et selon l'usage, les composants enfants peuvent être aussi réévalués.
- avec React ou Vue, tous les composants enfants sont réévalués.

Attention, réévalués ne peux pas forcément dire re-rendu dans le DOM, mais simplement qu'une partie du framework a dû revérifier les valeurs ou re-exécuter le js de certains composants.

Or, grâce à l'utilisation des Observables, on peut concevoir assez facilement un framework qui ne refresh que les nodes concernées avec un minimum de JS exécuté:

```ts
const textNode = new Text();
const date$ = map$$(interval(1000), () => new Date().toLocaleDateString());
date$((date: string) => {
  textNode.data = date;
});
```

C'est notamment aussi l'un des objectifs de `LiRX`: donner la meilleure expérience utilisateur possible grâce à des performances exceptionnelles
et un cadre pour éviter les erreurs fréquentes lors de l'usage de taches asynchrones.


