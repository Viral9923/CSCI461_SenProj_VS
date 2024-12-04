import React from "react";
import { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker, Button } from "antd";
import { UnorderedListOutlined, AreaChartOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Layout from "../components/Layout/Layout";
import  Spinner from "../components/Spinner";
import axios from "axios";
import moment from "moment";
import Analytics from "../components/Analytics";
import GeneratePdf from "./GeneratePdf";
const { RangePicker } = DatePicker;

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [transactionType, setTransactionType] = useState('');
  const [loading, setLoading] = useState(false);
  const [allTransaction, setAllTransaction] = useState([]);
  const [frequency, setFrequency] = useState("7");
  const [selectedDate, setSelectedDate] = useState([]);
  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState('table');
  const [editable, setEditable] = useState(null);

  // For antd Table to display data.
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (text) => 
        <span>{ moment(text).format("MM-DD-YYYY") }</span>
    },
    {
      title: "Amount",
      dataIndex: "amount"
    },
    {
      title: "Type",
      dataIndex: "type"
    },
    {
      title: "Category",
      dataIndex: "category"
    },
    {
      title: "Reference",
      dataIndex: "reference"
    },
    {
      title: "Description",
      dataIndex: "description"
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            className="edit-icon" 
            onClick={() => {
              setEditable(record);
              setShowModal(true);
            }} 
          />
          <DeleteOutlined 
            className="delete-icon mx-2"
            onClick={() => {handleDelete(record)}}
          />
        </div>
      )
    }
  ];

  const getAllTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      const res = await axios.post("/transactions/get-transaction", {
        userid: user._id,
        frequency,
        selectedDate,
        type
      });
      setLoading(false);
      setAllTransaction(res.data);
      console.log(res.data);
    } catch (error) {
      setLoading(false);
      message.error("Error getting transactions. Try again later.");
    }
  }

  useEffect(() => {
    getAllTransaction();
  },[frequency, selectedDate, type]);

  const handleDelete = async (record) => {
    try {
      setLoading(true);
      await axios.post("transactions/delete-transaction", 
        { transactionId: record._id }
      )
      setLoading(false);
      message.success("Transaction deleted successfully.");
      getAllTransaction();
    } catch (error) {
      console.log(error);
      setLoading(false);
      message.error("Unable to delete transaction.");
    }
  }

  const handleSubmit = async (values) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setLoading(true);
      if (editable) {
        await axios.post("/transactions/edit-transaction", {
          payload: {
            ...values,
            userid: user._id
          },
          transactionId: editable._id
        });
        setLoading(false);
        message.success("Transaction Updated Successfully.");
      } else {
        await axios.post("/transactions/add-transaction", { ...values, userid: user._id })
        setLoading(false);
        message.success("Transaction Added Successfully.");
      }
      setShowModal(false);
      setEditable(null);
      getAllTransaction();
    } catch (error) {
      setLoading(false);
      message.error("Failed to add transaction. ");
    }
  }

  return (
    <Layout>
      {loading && <Spinner /> }
      <div className="filters">
        <div className="frequency-filters">
          <h6>Select Frequency</h6>
          <Select value={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value="all">All Transactions</Select.Option>
            <Select.Option value="7">Previous Week</Select.Option>
            <Select.Option value="30" >Previous Month</Select.Option>
            <Select.Option value="365">Last 1 Year</Select.Option>
            <Select.Option value="custom">Custom</Select.Option>
          </Select>
          { frequency === "custom" && 
            <RangePicker 
            value={selectedDate} 
            onChange={(values) => setSelectedDate(values)}
            /> 
          }
        </div>
        <div className="type-filters">
          <h6>Select Type</h6>
          <Select value={type} onChange={(values) => setType(values)}>
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="income" >Income</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
          </Select>
        </div>
        <div className="mx-2 switch-icons">
            <UnorderedListOutlined className={`mx-2 ${viewData === "table" ? "active-icon" : "inactive-icon"}`} 
             onClick={() => setViewData("table")} 
            />
            <AreaChartOutlined className={`mx-2 ${viewData === "analytics" ? "active-icon" : "inactive-icon"}`}
             onClick={() => setViewData("analytics")} 
            />
        </div>
        <div>
        <GeneratePdf  className="mx-2" transactions={allTransaction} />
        <Button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add New
        </Button>
        </div>
      </div>
      <div className="content">
        { viewData === "table" ?
          <Table className="data-table" columns={columns} dataSource={allTransaction} /> : 
          <Analytics allTransaction={allTransaction} />
        }
      </div>
      <Modal
        title={editable ? "Edit Transaction" : "Add Transaction"}
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={false}>
          <Form layout="vertical" onFinish={handleSubmit} initialValues={editable}>
            <Form.Item label="Amount" name="amount">
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Type" name="type">
              <Select onChange={value => setTransactionType(value)}>
                <Select.Option value="income">Income</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>
              </Select>
            </Form.Item>
            {transactionType === 'income' && (
              <Form.Item label="Category" name="category">
                <Select>
                  <Select.Option value="salary">Salary</Select.Option>
                  <Select.Option value="bonus">Bonus</Select.Option>
                  <Select.Option value="business">Business</Select.Option>
                  <Select.Option value="socialsec">Social Security</Select.Option>
                  <Select.Option value="retirement">Retirement 401k</Select.Option>
                  <Select.Option value="investment">Investment</Select.Option>
                </Select>
              </Form.Item>
            )}
            {transactionType === 'expense' && (
              <Form.Item label="Category" name="category">
                <Select>
                  <Select.Option value="rent">Housing</Select.Option>
                  <Select.Option value="medical">Medical</Select.Option>
                  <Select.Option value="groceries">Groceries</Select.Option>
                  <Select.Option value="entertainment">Entertainment</Select.Option>
                  <Select.Option value="insurance">Insurance</Select.Option>
                  <Select.Option value="wellness">Beauty & Wellness</Select.Option>
                </Select>
              </Form.Item>
            )}
            <Form.Item label="Date" name="date">
              <Input type="date" />
            </Form.Item>
            <Form.Item label="Reference" name="reference">
              <Input type="text" />
            </Form.Item>
            <Form.Item label="Description" name="description">
              <Input type="text" />
            </Form.Item>
            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-success">
                Save 
              </button>
            </div>
          </Form>
      </Modal>
    </Layout>
  );
}

export default Home;