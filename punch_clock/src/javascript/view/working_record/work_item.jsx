var React = require("react");
var	Fluxxor = require("fluxxor"),
	FluxMixin = Fluxxor.FluxMixin(React);
	// StoreWatchMixin = Fluxxor.StoreWatchMixin;

var WorkItem = React.createClass({
	mixins: [FluxMixin],
	getInitialState: function() {
		return {
			active: false,
			startOffset: 0,
			offset: 0,
			startX: -1
		};
	},
	handleTouchStart: function(event) {
		this.startMoveTimeout = setTimeout(function(){
			this.setState({
				active: true
			});
		}.bind(this), 500);
		this.setState({
			active: false,
			startX: event.touches[0].clientX,
			startOffset: this.state.offset
		});
	},
	handleTouchEnd: function(event) {
		if(this.startMoveTimeout){
			clearTimeout(this.startMoveTimeout);
		}
		this.setState({
			active: false,
			startOffset: 0,
			startX: -1,
			offset: 0,
			// canMove: false
		});
		this.getFlux().actions.changeWorkingItemScore(this.props.title, this.props.score + this.state.offset);
	},
	handleTouchMove: function(event){
		if(this.state.active){
			var newOffset = this.state.startOffset + Math.floor((event.touches[0].clientX - this.state.startX) / 40);
			if(this.props.score + newOffset < 0){
				newOffset = 0 - this.props.score;
			}
			this.setState({
				offset: newOffset
			});
		}
	},
	render: function(){
		var workItemClass = this.state.active ? "WorkItem Active" : "WorkItem";
		return (
			<div className={workItemClass} onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd} onTouchMove={this.handleTouchMove}>
				<div className="Title">{this.props.title}</div>
				<div className="ScoreSelectorContainer">
					<div className="LeftArrow">&lt;</div>
					<div className="ScoreSelector">{this.props.score + this.state.offset}</div>
					<div className="RightArrow">&gt;</div>
				</div>
				<div className="Total">總計：{this.props.total}</div>
				<div className="LastModified">最後記錄日期：{this.props.lastModified.toLocaleString().split(" ")[0].replace(/\//g, ".")}</div>
			</div>
		);
	}
});

module.exports = WorkItem;