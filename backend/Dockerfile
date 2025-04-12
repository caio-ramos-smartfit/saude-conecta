FROM ruby:3.2.2-slim AS base

WORKDIR /rails

FROM base AS build

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential git libpq-dev pkg-config

COPY Gemfile Gemfile.lock ./

RUN bundle install

FROM base

RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y curl libvips postgresql-client && \
    rm -rf /var/lib/apt/lists /var/cache/apt/archives

COPY --from=build /usr/local/bundle/ /usr/local/bundle/

COPY . .

# Add a script to be executed every time the container starts
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh

# Create a user to run our application
RUN useradd rails --create-home --shell /bin/bash && \
    chown -R rails:rails /rails

# Entrypoint prepares the database.
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
