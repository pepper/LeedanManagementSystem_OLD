var React = require("react");

var WorkItem = React.createClass({
	getInitialState: function() {
		return {
			active: false,
			startOffset: 0,
			offset: 0,
			startX: -1
		};
	},
	handleTouchStart: function(event) {
		this.setState({
			active: true,
			startX: event.touches[0].clientX,
			startOffset: this.state.offset
		});
	},
	handleTouchEnd: function(event) {
		this.setState({
			active: false,
			startOffset: 0,
			startX: -1
		});
	},
	handleTouchMove: function(event){
		var newOffset = this.state.startOffset + Math.floor((event.touches[0].clientX - this.state.startX) / 20);
		if(this.props.score + newOffset < 0){
			newOffset = 0 - this.props.score;
		}
		this.setState({
			offset: newOffset
		});
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