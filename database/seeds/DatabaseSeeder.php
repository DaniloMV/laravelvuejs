<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        $faker=Faker\Factory::create();

        for($i=0;$i<100;$i++){
        	App\Blog::create([
        		'title' => $faker->catchPhrase,
            'description' => $faker->text,
            'showns' =>true
        		]);
        }
    }
}
 