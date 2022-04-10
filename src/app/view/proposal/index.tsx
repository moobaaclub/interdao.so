import { useHistory, useParams } from 'react-router-dom'

import { Button, Col, Row } from 'antd'
import IonIcon from 'shared/antd/ionicon'
import ProposalList from './proposalList'
import DaoDetails from '../dao/daoDetails'

import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

const Proposal = () => {
  const history = useHistory()
  const { daoAddress } = useParams<{ daoAddress: string }>()

  return (
    <Row gutter={[24, 24]} align="middle">
      <Col span={24}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Button
              icon={<IonIcon name="arrow-back-outline" />}
              type="text"
              onClick={() => history.push(`/app/${appId}/dao`)}
              style={{ marginLeft: -8 }}
            >
              Back
            </Button>
          </Col>
          <Col span={24}>
            <DaoDetails daoAddress={daoAddress} />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <ProposalList daoAddress={daoAddress} />
      </Col>
    </Row>
  )
}

export default Proposal
