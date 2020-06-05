const DEFAULT_PICTURE = 'http://placehold.it/100x100';

axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.post['Content-Type'] = 'application/json';


function getArticles() {
    return axios.get('/articles');
}

function addArticle(data) {
    return axios.post('/articles', {... {}, ...data })
}

function deleteArticle(id) {
    return axios.delete(`/articles/${id}`);
}

function createAboutArticle(article) {

    const $aboutArticle = $(`
    <li class="media mb-4">
        <img src="${article.picture || DEFAULT_PICTURE}" class="align-self-center mr-3" alt="...">
        <div class="media-body">
            <h5 id='title' class="mt-0 mb-1">${article.title}</h5>
            <p id='about'>${article.about}</p>
            <small id="author" class="text-muted">${article.author}</small>
        </div>
    </li>`);

    $aboutArticle.find('#title').on('click', (e) => {
        showArticle(article);
    });


    return $aboutArticle;
}

function showArticle(article) {

    const $article = $(`<div><h2>${article.title}</h2>
    <p>${article.article}</p>
    <button class='btn btn-primary' id="go-back">Go back</button>
    <button class='btn btn-danger' id="delete">Delete article</button>
    <div>`);

    $('#news-container').hide();

    $article.find('#go-back').on('click', (e) => {
        $('#news-container').show();
        $article.detach();
    });

    $article.find('#delete').on('click', (e) => {
        $('#news-container').show();
        deleteArticle(article.id);
        $article.detach();
    });

    $article.appendTo($('.container'));
}


function showAboutArticle(article) {
    const $aboutArticle = createAboutArticle(article);
    $aboutArticle.appendTo($('#news-list'));
}


function showModal() {
    const $modal = $(`<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <form>
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" class="form-control" id="title">
          </div>
        <div class="form-group">
          <label for="article">Article</label>
          <textarea rows='5' class="form-control" id="article"></textarea>
        </div>

        <div class="form-group">
        <label for="author">Author</label>
        <input type="text" class="form-control" id="author">
        </div>
      </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button id='save' type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>`);

    $modal.appendTo('body');
    $modal.modal('toggle');
    $modal.on('hidden.bs.modal', () => {
        $modal.detach();
    })

    $modal.find('#save').on('click', e => {
        const title = $modal.find('#title').val();
        const article = $modal.find('#article').val();
        const author = $modal.find('#author').val();
        const about = article.slice(0, 30);

        addArticle({ title, article, author, about }).then(resp => {
            if (resp.data) {
                resp.data.forEach(article => {
                    showAboutArticle(article);
                });
            } else {
                alert('No data!');
            }
        });
        $modal.modal('toggle');
    });
}

$(document).ready(() => {
    getArticles().then(resp => {
        if (resp.data) {
            resp.data.forEach(article => {
                showAboutArticle(article);
            });
        } else {
            alert('No data!');
        }
    }).catch(error => {
        alert('Error');
        console.log(error);
    });


    $('#add-article').on('click', e => {
        showModal();
    });

});