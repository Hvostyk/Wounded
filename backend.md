Сервис авторизации:

.env:

NODE_ENV="prod"

AUTH_DB_HOST="postgres"
AUTH_DB_PORT=5432
AUTH_DB_USERNAME="admin"
AUTH_DB_PASSWORD="password"
AUTH_DB_DATABASE="auth"
JWT_SECRET="secret"

docs:

openapi: 3.1.0
info:
    title: "auth-service"
    version: "1.0.0"
    contact:
        email: "bagomed.ofcl@gmail.com"
        name: "bagomed"
    description: "Authentication service for wounded musical service"

paths:
    /auth/register:
        summary: "Register - creating new account (not profile)"
        description: "Endpoint for user registration"

        post:
            summary: "Post authentication (register) data"
            description: "Endpoint for user registration"
            requestBody:
                required: true
                description: "Аuthentication data"
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                login:
                                    minLength: 5
                                    maxLength: 22
                                    type: string
                                password:
                                    $comment: "Add password validation"
                                    minLength: 6
                                    maxLength: 32
                                    type: string
                        example:
                            login: myLogin
                            password: myPassword
            responses:
                "201":
                    description: "User created successfully"
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    accessToken:
                                        type: string
                                    refreshToken:
                                        type: string
                "400":
                    description: "Authentication data does not meet the requirements"
                "409":
                    description: "User with this login is arleady exist"
                "429":
                    description: "Too many requests"
                "500":
                    description: "Internal server error"
            deprecated: false
    /auth/login:
        summary: "Login - login to an existing account"
        description: "Endpoint for user login"
        post:
            summary: "Post authentication (login) data"
            description: "Endpoint for user registration"
            requestBody:
                required: true
                description: "Authentication data"
                content:
                    application/json:
                        schema:
                            type: object
                            properties:
                                login:
                                    minLength: 5
                                    maxLength: 22
                                    type: string
                                password:
                                    $comment: "Add password validation"
                                    minLength: 6
                                    maxLength: 32
                                    type: string
            responses:
                "200":
                    description: "User login successfully"
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    accessToken:
                                        type: string
                                    refreshToken:
                                        type: string
                "400":
                    description: "Authentication data does not meet the requirements"
                "401":
                    description: "Invalid username or password"
                "429":
                    description: "Too many requests"
                "500":
                    description: "Internal server error"

    /auth/refresh:
        summary: "Send access token using refresh token"
        description: "Endpoint for getting acces token"
        get:
            parameters:
                - name: "refreshToken"
                  required: true
                  in: cookie
                  schema:
                      type: string
            responses:
                "200":
                    description: "Ok"
                    content:
                        application/json:
                            schema:
                                type: object
                "401":
                    description: "Invalid token"
                "429":
                    description: "Too many requests"
                "500":
                    description: "Internal server error"


Сервис профилей:

.env:

NODE_ENV="prod"

PROFILES_DB_HOST="postgres"
PROFILES_DB_PORT=5432
PROFILES_DB_USERNAME="admin"
PROFILES_DB_PASSWORD="password"
PROFILES_DB_DATABASE="profiles"
JWT_SECRET="secret"

docs:

openapi: 3.1.0
info:
    title: Profiles Service API
    version: 1.0.0
    description: Микросервис профилей пользователей

servers:
    - url: https://api.example.com

components:
    securitySchemes:
        accessToken:
            type: apiKey
            in: header
            name: accessToken

    schemas:
        Profile:
            type: object
            required: [userId, username]
            properties:
                userId:
                    type: string
                username:
                    type: string
                    minLength: 4
                    maxLength: 20
                description:
                    type: string
                    maxLength: 512

        CreateProfileRequest:
            type: object
            required: [username]
            properties:
                username:
                    type: string
                    minLength: 4
                    maxLength: 20
                description:
                    type: string
                    maxLength: 512

        UpdateProfileRequest:
            type: object
            properties:
                username:
                    type: string
                    minLength: 4
                    maxLength: 20
                description:
                    type: string
                    maxLength: 512

paths:
    /profiles:
        post:
            summary: Создать профиль
            security:
                - accessToken: []
            requestBody:
                required: true
                content:
                    application/json:
                        schema:
                            $ref: "#/components/schemas/CreateProfileRequest"
            responses:
                "201":
                    description: Профиль создан
                    content:
                        application/json:
                            schema:
                                $ref: "#/components/schemas/Profile"
                "400":
                    description: Неверные данные
                "401":
                    description: Неавторизован
                "409":
                    description: Профиль уже существует

    /profiles/me:
        patch:
            summary: Обновить свой профиль
            security:
                - accessToken: []
            requestBody:
                required: true
                content:
                    application/json:
                        schema:
                            $ref: "#/components/schemas/UpdateProfileRequest"
            responses:
                "200":
                    description: Профиль обновлён
                    content:
                        application/json:
                            schema:
                                $ref: "#/components/schemas/Profile"
                "400":
                    description: Неверные данные
                "401":
                    description: Неавторизован
                "404":
                    description: Профиль не найден

        get:
            summary: Получить свой профиль
            security:
                - accessToken: []
            responses:
                "200":
                    description: Профиль найден
                    content:
                        application/json:
                            schema:
                                $ref: "#/components/schemas/Profile"
                "401":
                    description: Неавторизован
                "404":
                    description: Профиль не найден

        delete:
            summary: Удалить свой профиль
            security:
                - accessToken: []
            responses:
                "200":
                    description: Профиль удалён
                "401":
                    description: Неавторизован
                "403":
                    description: Нет прав
                "404":
                    description: Профиль не найден

    /profiles/{userId}:
        get:
            summary: Получить профиль по userId
            security:
                - accessToken: []
            parameters:
                - name: userId
                  in: path
                  required: true
                  schema:
                      type: string
            responses:
                "200":
                    description: Профиль найден
                    content:
                        application/json:
                            schema:
                                $ref: "#/components/schemas/Profile"
                "401":
                    description: Неавторизован
                "404":
                    description: Профиль не найден

Сервис музыки:

.env:

NODE_ENV="prod"

PORT=7004
MUSIC_DB_HOST="postgres"
MUSIC_DB_PORT=5432
MUSIC_DB_USERNAME="admin"
MUSIC_DB_PASSWORD="password"
MUSIC_DB_DATABASE="music"
MUSIC_TMP_PATH="tmp/uploads"
MUSIC_DASH_TMP_PATH="tmp/dash"
MINIO_ENDPOINT="minio"
MINIO_PORT=9000
MINIO_PUBLIC_ENDPOINT="http://localhost:9000"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="music-tracks"
JWT_SECRET="secret"


 docs:

openapi: 3.1.0
info:
    title: Music Service API
    version: 1.0.0
    description: API сервиса для загрузки музыки, управления плейлистами и избранным

servers:
    - url: /api

security:
    - bearerAuth: []

paths:
    /music/uploads:
        post:
            summary: Загрузка трека
            description: Загрузка аудиофайла (mp3, wav < 20MB)
            requestBody:
                required: true
                content:
                    multipart/form-data:
                        schema:
                            type: object
                            required: [title, file]
                            properties:
                                title:
                                    type: string
                                    minLength: 1
                                    maxLength: 32
                                    description: Название трека
                                file:
                                    type: string
                                    format: binary
                                    description: Аудиофайл
            responses:
                "201":
                    description: Трек успешно загружен
                "202":
                    description: Принят в обработку (например, транскодирование)
                "400":
                    description: Ошибка валидации
                "401":
                    description: Не авторизован

    /music/uploads/{trackId}:
        delete:
            summary: Удаление трека
            parameters:
                - $ref: "#/components/parameters/TrackId"
            responses:
                "204":
                    description: Трек удалён
                "404":
                    description: Трек не найден
                "401":
                    description: Не авторизован

    /music/me/uploads:
        get:
            summary: Получить свои загруженные треки
            responses:
                "200":
                    description: Список загруженных треков
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    tracks:
                                        type: array
                                        items:
                                            $ref: "#/components/schemas/Track"
                "401":
                    description: Не авторизован

    /music/{userId}/uploads:
        get:
            summary: Получить загруженные треки пользователя
            parameters:
                - $ref: "#/components/parameters/UserId"
            responses:
                "200":
                    description: Список треков пользователя
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    tracks:
                                        type: array
                                        items:
                                            $ref: "#/components/schemas/Track"
                "401":
                    description: Не авторизован
                "403":
                    description: Доступ запрещён

    /music/me/favorites:
        post:
            summary: Добавить трек в избранное
            requestBody:
                required: true
                content:
                    application/json:
                        schema:
                            type: object
                            required: [trackId]
                            properties:
                                trackId:
                                    $ref: "#/components/schemas/UUID"
            responses:
                "201":
                    description: Добавлено в избранное
                "409":
                    description: Уже в избранном
                "401":
                    description: Не авторизован

        get:
            summary: Получить список избранного
            responses:
                "200":
                    description: Список избранных треков
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    tracks:
                                        type: array
                                        items:
                                            $ref: "#/components/schemas/Track"
                "401":
                    description: Не авторизован

    /music/me/favorites/{trackId}:
        delete:
            summary: Удалить трек из избранного
            parameters:
                - $ref: "#/components/parameters/TrackId"
            responses:
                "204":
                    description: Удалено из избранного
                "404":
                    description: Не найдено
                "401":
                    description: Не авторизован

    /music/{userId}/favorites:
        get:
            summary: Получить избранное пользователя
            parameters:
                - $ref: "#/components/parameters/UserId"
            responses:
                "200":
                    description: Список избранных треков
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    tracks:
                                        type: array
                                        items:
                                            $ref: "#/components/schemas/Track"

    /music/playlists:
        post:
            summary: Создать плейлист
            requestBody:
                required: true
                content:
                    application/json:
                        schema:
                            type: object
                            required: [title]
                            properties:
                                title:
                                    type: string
                                    maxLength: 64
                                    description: Название плейлиста
                                description:
                                    type: string
                                    maxLength: 256
                                    description: Описание
                                trackIds:
                                    type: array
                                    items:
                                        $ref: "#/components/schemas/UUID"
            responses:
                "201":
                    description: Плейлист создан

    /music/playlists/{playlistId}:
        patch:
            summary: Обновить плейлист
            parameters:
                - $ref: "#/components/parameters/PlaylistId"
            requestBody:
                content:
                    application/json:
                        schema:
                            $ref: "#/components/schemas/UpdatePlaylist"
            responses:
                "200":
                    description: Обновлено

        get:
            summary: Получить плейлист
            parameters:
                - $ref: "#/components/parameters/PlaylistId"
            responses:
                "200":
                    description: Данные плейлиста
                    content:
                        application/json:
                            schema:
                                $ref: "#/components/schemas/Playlist"

        delete:
            summary: Удалить плейлист
            parameters:
                - $ref: "#/components/parameters/PlaylistId"
            responses:
                "204":
                    description: Плейлист удалён

    /music/me/playlists:
        get:
            summary: Получить свои плейлисты
            responses:
                "200":
                    description: Список плейлистов
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    playlists:
                                        type: array
                                        items:
                                            $ref: "#/components/schemas/Playlist"

    /music/{userId}/playlists:
        get:
            summary: Получить плейлисты пользователя
            parameters:
                - $ref: "#/components/parameters/UserId"
            responses:
                "200":
                    description: Список плейлистов
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    playlists:
                                        type: array
                                        items:
                                            $ref: "#/components/schemas/Playlist"

    /music/albums:
        post:
            summary: Создать альбом
            requestBody:
                required: true
                content:
                    application/json:
                        schema:
                            type: object
                            required: [title]
                            properties:
                                title:
                                    type: string
                                    maxLength: 64
                                    description: Название альбома
                                description:
                                    type: string
                                    maxLength: 256
                                    description: Описание
                                trackIds:
                                    type: array
                                    items:
                                        $ref: "#/components/schemas/UUID"
            responses:
                "201":
                    description: Альбом создан

    /music/albums/{albumId}:
        patch:
            summary: Обновить альбом
            parameters:
                - $ref: "#/components/parameters/AlbumId"
            requestBody:
                content:
                    application/json:
                        schema:
                            $ref: "#/components/schemas/UpdateAlbum"
            responses:
                "200":
                    description: Обновлено

        get:
            summary: Получить альбом
            parameters:
                - $ref: "#/components/parameters/AlbumId"
            responses:
                "200":
                    description: Данные альбома
                    content:
                        application/json:
                            schema:
                                $ref: "#/components/schemas/Album"

        delete:
            summary: Удалить альбом
            parameters:
                - $ref: "#/components/parameters/AlbumId"
            responses:
                "204":
                    description: Альбом удалён

    /music/me/albums:
        get:
            summary: Получить свои альбомы
            responses:
                "200":
                    description: Список альбомов
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    albums:
                                        type: array
                                        items:
                                            $ref: "#/components/schemas/Album"

    /music/{userId}/albums:
        get:
            summary: Получить альбомы пользователя
            parameters:
                - $ref: "#/components/parameters/UserId"
            responses:
                "200":
                    description: Список альбомов
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    albums:
                                        type: array
                                        items:
                                            $ref: "#/components/schemas/Album"

components:
    securitySchemes:
        bearerAuth:
            type: http
            scheme: bearer
            bearerFormat: JWT

    parameters:
        TrackId:
            name: trackId
            in: path
            required: true
            schema:
                $ref: "#/components/schemas/UUID"

        PlaylistId:
            name: playlistId
            in: path
            required: true
            schema:
                $ref: "#/components/schemas/UUID"

        AlbumId:
            name: albumId
            in: path
            required: true
            schema:
                $ref: "#/components/schemas/UUID"

        UserId:
            name: userId
            in: path
            required: true
            schema:
                $ref: "#/components/schemas/UUID"

    schemas:
        UUID:
            type: string
            format: uuid

        Track:
            type: object
            properties:
                trackId:
                    $ref: "#/components/schemas/UUID"
                title:
                    type: string
                creatorId:
                    $ref: "#/components/schemas/UUID"
                creatorUsername:
                    type: string
                    description: Имя пользователя, загрузившего трек
                duration:
                    type: number
                    description: Длительность в секундах
                status:
                    type: string
                    enum: [processing, ready]
                bucketName:
                    type: string
                    description: S3/MinIO bucket with DASH assets
                objectPrefix:
                    type: string
                    description: Prefix containing DASH manifest and segments
                manifestObjectKey:
                    type: string
                    description: Object key for the DASH MPD manifest
                manifestUrl:
                    type: string
                    format: uri
                    description: Public URL for DASH playback manifest

        Playlist:
            type: object
            properties:
                playlistId:
                    $ref: "#/components/schemas/UUID"
                title:
                    type: string
                description:
                    type: string
                creatorId:
                    $ref: "#/components/schemas/UUID"
                trackIds:
                    type: array
                    items:
                        $ref: "#/components/schemas/UUID"

        UpdatePlaylist:
            type: object
            properties:
                title:
                    type: string
                description:
                    type: string
                trackIds:
                    type: array
                    items:
                        $ref: "#/components/schemas/UUID"

        Album:
            type: object
            properties:
                albumId:
                    $ref: "#/components/schemas/UUID"
                title:
                    type: string
                description:
                    type: string
                creatorId:
                    $ref: "#/components/schemas/UUID"
                trackIds:
                    type: array
                    items:
                        $ref: "#/components/schemas/UUID"

        UpdateAlbum:
            type: object
            properties:
                title:
                    type: string
                description:
                    type: string
                trackIds:
                    type: array
                    items:
                        $ref: "#/components/schemas/UUID"


Сервис стриминга:

.env: 

NODE_ENV="prod"

PORT=7005

JWT_SECRET="secret"

MINIO_ENDPOINT="minio"
MINIO_PORT=9000

MINIO_PUBLIC_ENDPOINT="http://localhost:9000"

MINIO_USE_SSL="false"

MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

MINIO_BUCKET="music-tracks"

docs:

openapi: 3.1.0
info:
    title: Music Streaming Service API
    version: 1.0.0
    description: API сервиса стриминга музыки по протоколу HLS

servers:
    - url: /api

paths:
    /stream/tracks/{trackId}:
        get:
            summary: Получить ссылку для стриминга трека
            description: |
                Возвращает HLS manifest (m3u8), который используется клиентом
                для потокового воспроизведения аудио.
            parameters:
                - $ref: "#/components/parameters/TrackId"
            responses:
                "200":
                    description: Ссылка на HLS manifest
                    content:
                        application/json:
                            schema:
                                type: object
                                properties:
                                    streamUrl:
                                        type: string
                                        format: uri
                                        description: Ссылка на m3u8 manifest
                                    expiresIn:
                                        type: number
                                        description: Время жизни ссылки в секундах
                "404":
                    description: Трек не найден
                "403":
                    description: Доступ запрещён (например, приватный трек)

    /stream/tracks/{trackId}/manifest:
        get:
            summary: Получить HLS manifest напрямую
            description: |
                Возвращает m3u8 файл. Используется, если клиент работает напрямую с API.
            parameters:
                - $ref: "#/components/parameters/TrackId"
            responses:
                "200":
                    description: HLS manifest
                    content:
                        application/vnd.apple.mpegurl:
                            schema:
                                type: string
                "404":
                    description: Трек не найден

    /stream/tracks/{trackId}/segments/{segmentId}:
        get:
            summary: Получить сегмент аудио
            description: |
                Возвращает сегмент потока (.ts или .aac).
                Обычно используется плеером автоматически.
            parameters:
                - $ref: "#/components/parameters/TrackId"
                - name: segmentId
                  in: path
                  required: true
                  schema:
                      type: string
            responses:
                "200":
                    description: Аудио сегмент
                    content:
                        video/mp2t:
                            schema:
                                type: string
                                format: binary
                "404":
                    description: Сегмент не найден

components:
    parameters:
        TrackId:
            name: trackId
            in: path
            required: true
            schema:
                type: string
                format: uuid

