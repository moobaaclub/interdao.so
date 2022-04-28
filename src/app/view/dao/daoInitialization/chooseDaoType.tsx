import { useDispatch, useSelector } from 'react-redux'

import { Card, Col, Radio, Row, Typography } from 'antd'

import { AppDispatch, AppState } from 'app/model'
import { setCreateDaoType } from 'app/model/dao.controller'

const DAO_TYPE = [
  {
    key: 'flexible-dao',
    label: 'Flexible DAO',
    description:
      'The Normal DAO has 3 regimes that allow you to create a DAO customized for your individual requirements, community structure, and governance token setup.',
    state: 1,
  },
  {
    key: 'multisig-dao',
    label: 'MultiSig DAO',
    description:
      'The Normal DAO has 3 regimes that allow you to create a DAO customized for your individual requirements, community structure, and governance token setup.',
    state: 0,
  },
]

const ChooseDaoType = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    dao: { daoType },
  } = useSelector((state: AppState) => state)

  const cardBorder = (key: string) =>
    daoType !== key ? { borderColor: 'transparent' } : {}

  return (
    <Row>
      <Col span={24}>
        <Radio.Group
          defaultValue={daoType}
          onChange={(e) => dispatch(setCreateDaoType(e.target.value))}
          className="btn-radio-card"
        >
          <Row gutter={[24, 24]}>
            {DAO_TYPE.map(({ key, label, description, state }) => (
              <Col xs={24} md={12} key={key}>
                <Radio.Button
                  value={key}
                  style={{ border: 'none' }}
                  disabled={!state}
                >
                  <Card
                    style={{ ...cardBorder(key) }}
                    className={`group-btn-card ${key}`}
                  >
                    {daoType === key}
                    <Row gutter={[12, 12]}>
                      <Col span={24}>
                        <Row>
                          <Col flex="auto">
                            <Typography.Title level={4}>
                              {label}
                            </Typography.Title>
                          </Col>
                          {!state && (
                            <Col>
                              <Typography.Title level={4}>
                                Coming soon
                              </Typography.Title>
                            </Col>
                          )}
                        </Row>
                      </Col>
                      <Col span={24}>
                        <Typography.Text type="secondary">
                          {description}
                        </Typography.Text>
                      </Col>
                    </Row>
                  </Card>
                </Radio.Button>
              </Col>
            ))}
          </Row>
        </Radio.Group>
      </Col>
    </Row>
  )
}

export default ChooseDaoType
