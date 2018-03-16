exports.seed = function(knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('palettes').del() // delete all footnotes first
    .then(() => knex('projects').del()) // delete all papers

    // Now that we have a clean slate, we can re-insert our paper data
    .then(() => {
      return Promise.all([

        knex('projects').insert({
          name: 'Fun Project'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { 
              name: 'Warm Colors', 
              project_id: project[0], 
              color_1: '#3E92CC',
              color_2: '#3E92CC',  
              color_3: '#3E92CC',  
              color_4: '#3E92CC',  
              color_5: '#3E92CC',
            },
            { 
              name: 'Cool Colors', 
              project_id: project[0], 
              color_1: '#59F8E8',
              color_2: '#59F8E8',  
              color_3: '#59F8E8',  
              color_4: '#59F8E8',  
              color_5: '#59F8E8',  
            }
          ]);
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
