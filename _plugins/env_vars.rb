# _plugins/env_vars.rb
module Jekyll
  class EnvVarsGenerator < Generator
    priority :high

    def generate(site)
      # O Ruby lê o que está no 'export' (PC) ou no 'Environment Variables' (Netlify)
      # e injeta no objeto 'site.env' que usamos no HTML.
      site.config['env'] = {
        'api_key'             => ENV['JEKYLL_FIREBASE_API_KEY'],
        'auth_domain'         => ENV['JEKYLL_FIREBASE_AUTH_DOMAIN'],
        'project_id'          => ENV['JEKYLL_FIREBASE_PROJECT_ID'],
        'storage_bucket'      => ENV['JEKYLL_FIREBASE_STORAGE_BUCKET'],
        'messaging_sender_id' => ENV['JEKYLL_FIREBASE_MESSAGING_SENDER_ID'],
        'app_id'              => ENV['JEKYLL_FIREBASE_APP_ID'],
        'measurement_id'      => ENV['JEKYLL_FIREBASE_MEASUREMENT_ID']
      }
      
      # Log para você ver no terminal (local ou Netlify) se ele achou as chaves
      if site.config['env']['api_key']
        puts "🚀 [Firebase Plugin]: Chaves carregadas com sucesso!"
      else
        puts "⚠️ [Firebase Plugin]: ATENÇÃO! Chaves não encontradas no ambiente."
      end
    end
  end
end
