"use strict";

var React = require("react-native");
var Icon = require("FAKIconImage");

var Action = require("../model/action");
var NumberButton = require("./number_button");

var Color = require("../basic/color_definition");
var Animation = require("../basic/animation_definition");

var Styles = require("./style");

var {
	Text,
	View,
	TouchableWithoutFeedback,
	LayoutAnimation,
} = React;

var styles = Styles.ios;

var WorkingItem = React.createClass({
	getInitialState: function(){
		return {
			score_list: [],
			current_input: 0,
			last_record_datetime: new Date(),
		}
	},
	componentWillReceiveProps: function(nextProps){
		this.setState({
			current_input: 0,
		});
	},
	onNumberPressHandler: function(number){
		this.setState({
			current_input: (this.state.current_input * 10) + number,
		});
	},
	onTitlePressHandler: function(){
		LayoutAnimation.configureNext(Animation.spring);
		if(this.props.selectWorkingItem){
			this.props.selectWorkingItem(this.props.title);
		}
	},
	onCancelPressHandler: function(){
		LayoutAnimation.configureNext(Animation.spring);
		if(this.props.selectWorkingItem){
			this.props.selectWorkingItem("");
		}
		Action.addCurrentWorkingItem(this.props.title, 0);
	},
	onSubmitPressHandler: function(){
		LayoutAnimation.configureNext(Animation.spring);
		if(this.props.selectWorkingItem){
			this.props.selectWorkingItem("");
		}
		Action.addCurrentWorkingItem(this.props.title, this.state.current_input);
	},
	render: function(){
		var numberButtonList = Array.apply(0, Array(10)).map(function(item, index){
			return (
				<NumberButton key={this.props.title + ".NumberButton." + index} number={index} callback={this.onNumberPressHandler}/>
			)
		}.bind(this));
		return (
			<View style={styles.workingItem}>
				<TouchableWithoutFeedback onPress={this.onTitlePressHandler}>
					<View style={styles.workingItemTitle}>
						<View style={[styles.workingItemTitleColumn, (this.props.editMode && styles.workingItemTitleColumnEdit), styles.workingItemColumn1]}>
							<Text style={[styles.workingItemTextTitle, styles.workingItemText, (this.props.editMode && styles.workingItemTextEdit)]}>{this.props.title}</Text>
							<Text style={[styles.workingItemTextLastRecordDatetime, styles.workingItemText, (this.props.editMode && styles.workingItemTextEdit)]}>{"最後紀錄日期：" + this.state.last_record_datetime.getFullYear() + "." + (this.state.last_record_datetime.getMonth() + 1) + "." + this.state.last_record_datetime.getDate()}</Text>
						</View>
						<View style={[styles.workingItemTitleColumn, (this.props.editMode && styles.workingItemTitleColumnEdit), styles.workingItemColumn2]}>
							<Text style={[styles.workingItemTextTodaysRecord, styles.workingItemText, (this.props.editMode && styles.workingItemTextEdit)]}>{"Today\'s Record"}</Text>
							<Text style={[styles.workingItemTextScore, styles.workingItemText, (this.props.editMode && styles.workingItemTextEdit)]}>{this.state.score_list.join(" + ") + ((this.state.current_input == 0)?this.props.pointToAdd:this.state.current_input)}</Text>
						</View>
						<View style={[styles.workingItemTitleColumn, (this.props.editMode && styles.workingItemTitleColumnEdit), styles.workingItemColumn3]}>
							{
								(this.props.editMode)?
								<View style={styles.workingItemActionContainer}>
									<TouchableWithoutFeedback onPress={this.onCancelPressHandler}>
										<View style={[styles.workingItemActionButton, styles.workingItemActionButtonFirst]}>
											<Icon
												name={"fontawesome|eraser"}
												size={25}
												color={Color.black}
												style={styles.workingItemActionIcon}
											/>
											<Text style={styles.workingItemActionText}>{"取消"}</Text>
										</View>
									</TouchableWithoutFeedback>
									<TouchableWithoutFeedback onPress={this.onSubmitPressHandler}>
										<View style={styles.workingItemActionButton}>
											<Icon
												name={"fontawesome|pencil"}
												size={25}
												color={Color.black}
												style={styles.workingItemActionIcon}
											/>
											<Text style={styles.workingItemActionText}>{"確認"}</Text>
										</View>
									</TouchableWithoutFeedback>
								</View>
								:
								<View>
									<Text style={[styles.workingItemTextTodaysRecord, styles.workingItemText, (this.props.editMode && styles.workingItemTextEdit)]}>{"Total Record"}</Text>
									<Text style={[styles.workingItemTextScore, styles.workingItemText, (this.props.editMode && styles.workingItemTextEdit)]}>{this.state.score_list.join(" + ") + this.state.current_input}</Text>
								</View>
							}
						</View>
					</View>
				</TouchableWithoutFeedback>
				{
					(this.props.editMode)?
						<View style={styles.workingItemNumberContainer}>{numberButtonList}</View>:null
				}
			</View>
		);
	}
});

module.exports = WorkingItem;