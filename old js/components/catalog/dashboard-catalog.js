var _catalog = [];

for(var i=1; i<9; i++){
    _catalog.push({
        'id': 'HighChart' + i,
        'title': 'HighChart #' + i,
        'summary': 'This is a useful metric to visualize!',
        'description': 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
        'img': '/assets/chart.png'
    });
}

module.exports = _catalog;