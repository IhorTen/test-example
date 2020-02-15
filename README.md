
### Страница HomePage
Форма для регистрации новых кандидатов. При загрузке страницы происходит запрос на существующие позиции. Запрос `Positions`:
```
 {
     endpoint: /api/positions/,
     method: "GET"
 }
``` 
Возвращает список позиций с их id:
```
 {
    id: string,
    name: string,
}
```
После заполнения всех данных (если они валидны), при нажатии на Submit происходит запрос на регистрацию нового кандидата. все данные высылаются по запросу `Sign-Up`:
 ```
 {
    endpoint: /api/auth/sign-up,
    method: "POST"
 }
```
  Данные в формате `FormData`.
  ```
  {
    fullName: string,
    email: string,
    phone: string,
    position: string,
    cv: File
  }
  ```
  Если кандидат успешно зарегестрирован, в Response запроса `Sign-Up` приходят токены:
  ```
  {
    access_token: string,
    refresh_token: string
  }
```
которые я записываю в хранилище и localStorage. В дальнейшем они используются для аунтефикации пользователя, если например истекло время действия access_token. Все другие запросы, кроме регистрации и позиций, будут использовать в headers `access_token`. После успешного получения и записи токенов, сразу же выполняется запрос `Identity`:
```
{
    endpoint: "/api/candidates/identity",
    method: "GET",
    headers: {"Authorization": `Bearer ${access_token}`}
}
```
Запрос на получение всей необходимой информации о пользователе используя его `access_token`. В response необхожим получить:
```
{
    server_time: number,
    email: string,
    full_name: string,
    candidate_quizzes: [
        {
            quiz_id: string,
            quiz_name: string,
            quiz_description?: string,
            quiz_duration: number,
            start_time?: number,
            finish_time?: number,
            status: "pending" | "started" | "finished"
        }
    ]
}
```
`Candidate_quizzes` это список тестов доступных кандидату. Их может быть несколько. Пока что есть только когнитывный, но в дальшейшем (в зависимости от выбранной позиции) будут разные профильные (технические) тесты. `server_time` время когда был сделан запрос, значение в `timestamp`.
После успешного получения теста, пользователя перенаправляют на страницу `InfoPage`
### Страница InfoPage
Отображение информации по текущему ("pending") тесту. При нажатии на кнопку "Continue", всплывает модалка, где кандидату говориться что тест начнется по нажатию на кнопку "Begin Test". При нажатии происходит запрос `initQuiz`:
```
{
    endpoint: `/api/candidates/quizzes/${nextQuizId}`,
    method: "POST",
    headers: {"Authorization": `Bearer ${access_token}`}
    data: {
        action: "started"
    }
}
```
`nextQuizId` - id теста (quiz) который имеет статус "pending", одним слово я в url высылаю id теста, и говорю что ему надо поменять статус на "started" (`action: "started"`). Если запрос успешен, то кандидата перенеправляет на страницу самого теста. При загрузке страницы происходит запрос на `getQuizData`(получение самого теста):
```
{
    endpoint: `/api/quizzes/${currQuizId}`,
    method: "GET",
    headers: {"Authorization": `Bearer ${access_token}`}
}
```
`currQuizId` id теста (quiz) который имеет статус "started". Если запрос выполнен успешно, то приходит тело самого теста, и вопросами и вариантами ответов:
```
{
    quiz_name: string,
    questions: [
        {
            question_id: string,
            question_content: string,
            weight?: 2.0,
            variants: [
                {
                    variant_id: string,
                    variant_content: string
                }
            ]
        }
    ]
}
```
Кандидат начинаем прохожэение теста. При ответе на вопрос выполняется запрос `answerRequest`:
```
{
    endpoint: `/api/candidates/quizzes/${currQuizId}/answer`,
    method: "POST",
    headers: {"Authorization": `Bearer ${access_token}`},
    data: {
        question_id: string,
        variant_id: string,
    }
}
```
Присылаю id вопроса и id ответа.
При окончании теста, когда кандидат ответил на все вопросы, или когда вышло время, выполняется запрос `finishQuiz`:
```
{
    endpoint: `/api/candidates/quizzes/${currQuizId}`,
    method: "POST",
    headers: {"Authorization": `Bearer ${access_token}`},
    data: {
        action: "finished"
    }
}
```
После этого кандидата перенаправляет на страницу `Thankyou`. Прохождение теста завершено.
## Запрос на Refresh Token
Почти в каждом запросе в header высылается accesss_token. И если по каким-то причинам этот токен стал не валидным ( если пользовательно долго был на InfoPage и не начинал тест, или по каким-то другим причинам), выполняется запрос `RefreshToken`:
```
{
    endpoint: `/api/auth/refresh`,
    method: "POST",
    headers: {"Authorization": `Bearer ${refresh_token}`}
}
```
При успешном выполнении запроса приходит новый `access_token`. Он перезаписывается, и слудующие запросы будут выполняться уже с новым `access_token`.