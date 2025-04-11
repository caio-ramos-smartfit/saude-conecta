class CreateAppointments < ActiveRecord::Migration[7.0]
  def change
    create_table :appointments do |t|
      t.references :patient, null: false, foreign_key: true
      t.references :provider, null: false, foreign_key: true
      t.date :date, null: false
      t.time :time, null: false
      t.integer :duration, null: false
      t.string :service, null: false
      t.string :status, null: false, default: 'pending'
      t.text :notes

      t.timestamps
    end
  end
end
