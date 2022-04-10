import { Redirect, Route, Switch } from 'react-router-dom'

import { Row, Col } from 'antd'
import Dao from './dao'
import Proposal from './proposal'
import ProposalInitialization from './proposal/proposalInitialization'
import DaoInitialization from './dao/daoInitialization'
import ProposalDetails from './proposal/proposalDetails'
import DaoWatcher from './watcher/dao.watcher'
import ProposalWatcher from './watcher/proposal.watcher'
import ReceiptWatcher from './watcher/receipt.watcher'

import 'app/static/styles/index.less'
import configs from 'app/configs'

const {
  manifest: { appId },
} = configs

const View = () => {
  return (
    <Row gutter={[24, 24]} justify="center">
      <Col xs={24} lg={18}>
        <Switch>
          <Route exact path={`/app/${appId}/dao`} component={Dao} />
          <Route
            exact
            path={`/app/${appId}/dao/new-dao`}
            component={DaoInitialization}
          />
          <Route
            exact
            path={`/app/${appId}/dao/:daoAddress`}
            component={Proposal}
          />
          <Route
            exact
            path={`/app/${appId}/dao/:daoAddress/new-proposal`}
            component={ProposalInitialization}
          />
          <Route
            exact
            path={`/app/${appId}/dao/:daoAddress/proposal/:proposalAddress`}
            component={ProposalDetails}
          />
          <Redirect from="*" to={`/app/${appId}/dao`} />
        </Switch>
      </Col>
      <Col span={24} />
      <DaoWatcher />
      <ProposalWatcher />
      <ReceiptWatcher />
    </Row>
  )
}

export default View
