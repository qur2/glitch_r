export default [{
	name: 'color spill',
	params: [{
		name: 'channel',
		type: 'enum',
		values: ['red', 'green', 'blue']
	}, {
		name: 'direction',
		type: 'enum',
		values: ['horizontal', 'vertical', 'bidirectional']
	}, {
		name: 'amount',
		type: 'range',
		values: ['1', '25', '2']
	}]
}, {
	name: 'white up, dark down',
	params: [{
		name: 'treshold',
		type: 'range',
		values: ['15', '25', '75']
	}, {
		name: 'amount',
		type: 'range',
		values: ['1', '25', '2']
	}]
}]