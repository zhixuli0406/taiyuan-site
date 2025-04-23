import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getStoreSettings,
  updateStoreSettings,
  getLogoPresignedUrl,
  updateStoreLogo
} from "../api/storeSettings"
import {
  setStoreSettings,
  setLoading,
  setError
} from "../redux/slices/storeSettingsSlice"
import { Button, Input, Form, message, Upload } from "antd"
import { UploadOutlined } from "@ant-design/icons"

const StoreSettings = () => {
  const dispatch = useDispatch()
  const { settings, loading, error } = useSelector((state) => state.storeSettings)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchStoreSettings()
  }, [])

  const fetchStoreSettings = async () => {
    try {
      dispatch(setLoading(true))
      const data = await getStoreSettings()
      dispatch(setStoreSettings(data))
      form.setFieldsValue(data)
    } catch (err) {
      dispatch(setError(err.message))
      message.error("獲取商店設定失敗")
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleSubmit = async (values) => {
    try {
      dispatch(setLoading(true))
      await updateStoreSettings(values)
      dispatch(setStoreSettings(values))
      message.success("商店設定更新成功")
    } catch (err) {
      dispatch(setError(err.message))
      message.error("更新商店設定失敗")
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleLogoUpload = async (file) => {
    try {
      // 獲取預簽名 URL
      const { presignedUrl } = await getLogoPresignedUrl(file.type)
      
      // 上傳文件到 S3
      await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type
        }
      })

      // 更新商店 Logo
      const imageUrl = presignedUrl.split("?")[0]
      await updateStoreLogo(imageUrl)
      
      message.success("Logo 上傳成功")
      fetchStoreSettings()
    } catch (err) {
      message.error("Logo 上傳失敗")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">商店設定</h1>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={settings}
      >
        <Form.Item
          label="商店名稱"
          name="storeName"
          rules={[{ required: true, message: "請輸入商店名稱" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="商店描述"
          name="storeDescription"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="商店 Logo"
        >
          <Upload
            beforeUpload={handleLogoUpload}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>上傳 Logo</Button>
          </Upload>
          {settings?.logoUrl && (
            <img
              src={settings.logoUrl}
              alt="商店 Logo"
              className="mt-2 w-32 h-32 object-contain"
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            保存設定
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default StoreSettings 