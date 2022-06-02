import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { account, AccountData } from '@senswap/sen-js'
import CopyToClipboard from 'react-copy-to-clipboard'

import { Col, Row, Space, Tooltip, Typography } from 'antd'
import MintBalance from './mintBalance'
import RowSpaceBetween from 'app/components/rowSpaceBetween'
import IonIcon from 'shared/antd/ionicon'

import { AppState } from 'app/model'
import useTotalUSD from 'app/hooks/useBalance'
import { asyncWait, numeric, shortenAddress } from 'shared/util'

const InfoDAOMaster = ({ daoAddress }: { daoAddress: string }) => {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    setCopied(true)
    await asyncWait(1500)
    setCopied(false)
  }

  return (
    <RowSpaceBetween
      label="Treasury Address"
      value={
        <Space>
          <Typography.Text className="t-16">
            {shortenAddress(daoAddress)}
          </Typography.Text>
          <Tooltip title="Copied" visible={copied}>
            <CopyToClipboard text={daoAddress} onCopy={onCopy}>
              <Typography.Text style={{ cursor: 'pointer' }} className="t-16">
                <IonIcon name="copy-outline" />
              </Typography.Text>
            </CopyToClipboard>
          </Tooltip>
        </Space>
      }
    />
  )
}

const Treasury = ({ daoAddress }: { daoAddress: string }) => {
  const [listAccount, setListAccount] = useState<AccountData[]>([])
  const totalUSD = useTotalUSD({ accounts: listAccount })

  const {
    dao: { daos },
  } = useSelector((state: AppState) => state)

  const daoMasterAddress = useMemo(() => {
    const { master } = daos[daoAddress] || {}
    return master?.toBase58() || ''
  }, [daos, daoAddress])

  const fetchAccount = useCallback(async () => {
    if (!daoMasterAddress) return

    const { splt } = window.sentre
    const ownerPublicKey = account.fromAddress(daoMasterAddress)
    const { value } = await splt.connection.getTokenAccountsByOwner(
      ownerPublicKey,
      { programId: splt.spltProgramId },
    )
    let bulk: AccountData[] = []
    await Promise.all(
      value.map(async ({ account: { data: buf } }) => {
        const data = splt.parseAccountData(buf)
        const mintInfo = await splt.getMintData(data.mint)
        if (!(mintInfo.decimals === 0) && !(Number(mintInfo.supply) === 1))
          return bulk.push(data)
      }),
    )
    return setListAccount(bulk)
  }, [daoMasterAddress])

  useEffect(() => {
    fetchAccount()
  }, [fetchAccount])

  return (
    <Row gutter={[8, 8]}>
      <Col span={24}>
        <Row align="middle">
          <Col flex="auto">
            <Space align="baseline">
              <Typography.Text type="secondary">
                Treasury Balance
              </Typography.Text>
              <Tooltip
                placement="bottomLeft"
                overlayClassName="info-member treasury-addr"
                title={<InfoDAOMaster daoAddress={daoMasterAddress} />}
              >
                <IonIcon
                  style={{ cursor: 'pointer' }}
                  name="information-circle-outline"
                />
              </Tooltip>
            </Space>
          </Col>
          <Col>
            <Typography.Title level={4}>
              ${numeric(totalUSD).format('0,0.[000]')}
            </Typography.Title>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row gutter={[24, 24]} className="scrollbar" style={{ height: 124 }}>
          {listAccount &&
            listAccount.map((account) => (
              <Col span={24} key={account.mint}>
                <MintBalance account={account} />
              </Col>
            ))}
        </Row>
      </Col>
    </Row>
  )
}

export default Treasury
