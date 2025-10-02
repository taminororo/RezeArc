up:
	docker compose up -d

up-build:
	docker compose up -d --build

ps:
	docker compose ps

logs:
	docker compose logs

exec:
	docker compose exec -it next-app sh

down:
	docker compose down

