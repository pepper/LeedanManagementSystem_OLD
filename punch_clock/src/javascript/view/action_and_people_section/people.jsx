var React = require("react");
var	Router = require("react-router"),
	Link = Router.Link;

var People = React.createClass({
	render: function(){
		var editMode = false;
		if(String(this.props.editMode) == "true"){
			editMode = true;
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

		if(editMode){
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

		var result = <div className={classString}>
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

		if(this.props.url && this.props.url != ""){
			result = <Link to={this.props.url}>
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
					</Link>
		}

		return result;
	}
});

module.exports = People;