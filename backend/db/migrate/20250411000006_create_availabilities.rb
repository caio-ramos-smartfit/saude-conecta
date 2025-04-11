class CreateAvailabilities < ActiveRecord::Migration[7.0]
  def change
    create_table :availabilities do |t|
      t.references :provider, null: false, foreign_key: true
      t.date :date, null: false
      t.time :start_time, null: false
      t.time :end_time, null: false
      t.boolean :is_available, null: false, default: true
      t.decimal :cost, precision: 8, scale: 2

      t.timestamps
    end
  end
end
