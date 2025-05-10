module Api
  module V1
    class SwaggerController < ApplicationController
      include Swagger::Blocks

      swagger_root do
        key :swagger, '2.0'
        info do
          key :version, '1.0.0'
          key :title, 'SaúdeConecta API'
          key :description, 'API para o aplicativo SaúdeConecta'
          contact do
            key :name, 'SaúdeConecta Team'
          end
        end
        
        key :basePath, '/api/v1'
        key :produces, ['application/json']
        key :consumes, ['application/json']
        
        security_definition :Bearer do
          key :type, :apiKey
          key :name, :Authorization
          key :in, :header
          key :description, 'JWT token de autenticação. Exemplo: Bearer {token}'
        end
      end

      def index
        render html: '<h1>API Documentation</h1><p>Access the Swagger UI at <a href="/api-docs">/api-docs</a></p>'.html_safe
      end

      def json
        swagger_classes = [
          self.class,
          Api::V1::UsersController,
          Api::V1::SessionsController,
          Api::V1::RegistrationsController
        ]
        swagger_data = Swagger::Blocks.build_root_json(swagger_classes)
        render json: swagger_data
      end
    end
  end
end
