SHELL := /bin/sh

.PHONY: install build up down logs api worker migrate seed

install:
	cd src && npm install

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

logs:
	docker compose logs -f --tail=200

api:
	docker compose logs -f --tail=200 api

worker:
	docker compose logs -f --tail=200 worker

migrate:
	docker compose run --rm api npm run migrate

seed:
	docker compose run --rm api npm run seed
