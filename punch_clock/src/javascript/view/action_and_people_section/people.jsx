var React = require("react");

var People = React.createClass({
	render: function(){
		if(String(this.props.editMode) == "true"){
			this.props.editMode = true;
		}
		else{
			this.props.editMode = false;
		}
		
		var classString = "Item People";
		if(this.props.active){
			classString += " Active";
		}

		var scoreTrendIconString = "";
		var scoreTrendString = "";
		if(this.props.scoreTrend == "up"){
			scoreTrendIconString = "Up";
			scoreTrendString = "▲";
		}
		else if(this.props.scoreTrend == "down"){
			scoreTrendIconString = "Down";
			scoreTrendString = "▼";
		}
		var scoreString = this.props.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		var icon = "data:image/jpg;base64," + this.props.avatar;

		if(this.props.editMode){
			icon = <div className="Icon">
						<i className="fa fa-minus-square"></i>
					</div>
		}
		else{
			var avatarString = "data:image/jpg;base64," + this.props.avatar;
			icon = <div className="Icon">
						<img className="Avatar" src={avatarString} />
					</div>
		}

		return (
			<div className={classString}>
				<div className="LeftColumn">
					{icon}
					<div className="NameAndIDNumber">
						<div>{this.props.name}</div>
						<div>{this.props.idNumber}</div>
					</div>
				</div>
				<div className="RightColumn">
					<div className="ScoreTitle">
						Total score <span className={scoreTrendIconString}>{scoreTrendString}</span>
					</div>
					<div className="ScoreValue">{scoreString}</div>
				</div>
			</div>
		);
	}
});

module.exports = People;