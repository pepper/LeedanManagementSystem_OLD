var React = require("react");

var PaySheet = React.createClass({
	getInitialState: function(){
		return {

		};
	},
	render: function(){
		var printDate = function(input){
			var date = Date.parse(input);
			if(!isNaN(date)){
				date = new Date(date);
				return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
			}
			else{
				return "無資料";
			}
		}
		var printTime = function(input){
			var date = Date.parse(input);
			if(!isNaN(date)){
				date = new Date(date);
				return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
			}
			else{
				return "無資料";
			}
		}
		var calculateWorkHour = function(input1, input2){
			var date1 = Date.parse(input1);
			var date2 = Date.parse(input2);
			if(!isNaN(date1) && !isNaN(date2)){
				var result = ((Math.abs(date1 - date2)) / 1000) / 60;
				return Math.round(result / 60);
			}
			else{
				return 0;
			}
		}
		var rows = [];
		this.props.punch_record.date_record_list.forEach(function(dateRecord){
			if(dateRecord.raw_record_list.length > 0){
				var columns = [];
				columns.push(<td className="Dark">{printDate(dateRecord.date)}</td>);
				var sumHour = 0;
				dateRecord.working_hours.forEach(function(workingHours){
					columns.push(<td>{printTime(workingHours.real_start_time)}<br />{printTime(workingHours.real_end_time)}</td>);
					var hour = calculateWorkHour(workingHours.real_start_time, workingHours.real_end_time);
					sumHour = sumHour + hour;
					columns.push(<td className="Dark">{hour} hr</td>);
				}.bind(this));
				columns.push(<td className="DarkLight">{sumHour} hr</td>);
				columns.push(<td>0</td>);
				rows.push(
					<tr>{columns}</tr>
				);
			}
		}.bind(this));
		return (
			<div>
				<div className="PaySheet">
					<div className="Title">{this.props.title}</div>
					<div className="Group">
						<div>員工姓名：{this.props.name}</div>
						<div>員工編號：{this.props.id_number}</div>
						<div>月薪：{this.props.accounting.salary.value}</div>
					</div>
					<div className="Group">
						<div>遲到次數：{this.props.punch_record.late.times}次</div>
						<div>遲到累計：{this.props.punch_record.late.cumulative_time}</div>
						<div>使用特休：{this.props.leave.total.annual}</div>
						<div>尚餘特休：{this.props.leave.quota.annual_leave_left}</div>
					</div>
					<div className="Group">
						<div>職務加給：{this.props.accounting.professional_allowance}</div>
						<div>全勤獎金：{this.props.accounting.no_leave_bonus}</div>
						<div>交通補助：{this.props.accounting.travel_allowance}</div>
						<div>年終（三節）獎金：{this.props.accounting.holiday_bonus}</div>
						<div>餐費補助：{this.props.accounting.food_allowance}</div>
					</div>
					<div className="Group">
						<div>遲到扣除薪資：</div>
						<div>{this.props.accounting.late_fines}</div>
						<div>勞保費：{this.props.accounting.labor_insurance}</div>
						<div>健保費：{this.props.accounting.health_insurance}</div>
					</div>
					<div className="Group">
						<div className="Summary">總計：{this.props.accounting.total}</div>
						<br /><br /><br />
						<div>最後記錄日期：{(this.props.generate_datetime).toString().substr(0, 10)}</div>
					</div>
				</div>
				<div className="PaySheetPunchRecord">
					<table>
						<thead>
							<tr>
								<th>日期</th>
								<th>上班<br />下班</th>
								<th className="Dark">累計<br />工時</th>
								<th>上班<br />下班</th>
								<th className="Dark">累計<br />工時</th>
								<th>上班<br />下班</th>
								<th className="Dark">累計<br />工時</th>
								<th>總工時</th>
								<th>餐費補助</th>
							</tr>
						</thead>
						<tbody>
							{rows}
						</tbody>
					</table>
				</div>
			</div>
		);
	}
});

module.exports = PaySheet;