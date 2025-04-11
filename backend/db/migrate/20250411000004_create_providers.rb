class CreateProviders < ActiveRecord::Migration[7.0]
  def change
    create_table :providers do |t|
      t.references :user, null: false, foreign_key: true
      t.string :organization_name
      t.string :contact_name
      t.string :specialty
      t.text :address
      t.string :phone

      t.timestamps
    end
  end
end
