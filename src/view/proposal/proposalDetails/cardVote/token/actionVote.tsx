import { Fragment, useCallback, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { account, utils } from '@senswap/sen-js'
import { DaoData } from '@interdao/core'
import { BN } from 'bn.js'
import { util } from '@sentre/senhub'

import { Button, Col, Row } from 'antd'
import IonIcon from '@sentre/antd-ionicon'

import { AppState } from 'model'
import { ProposalChildCardProps } from '../../index'
import configs from 'configs'
import { useAccountBalanceByMintAddress } from 'shared/hooks/useAccountBalance'
import useProposalStatus from 'hooks/proposal/useProposalStatus'
import useMetaData from 'hooks/useMetaData'
import useProposalFee from 'hooks/proposal/useProposalFee'
import { setVoteBidAmount } from 'model/voteBid.controller'

const {
  sol: { interDao },
} = configs

const DEFAULT_VALUE_VOTE_MULTISIG = 1

const ActionVote = ({
  proposalAddress,
  daoAddress,
}: ProposalChildCardProps) => {
  const [loadingFor, setLoadingFor] = useState(false)
  const [loadingAgainst, setLoadingAgainst] = useState(false)
  const daos = useSelector((state: AppState) => state.daos)
  const amount = useSelector((state: AppState) => state.voteBid.amount)
  const dispatch = useDispatch()
  const { mint } = daos[daoAddress] || ({} as DaoData)
  const { balance, decimals } = useAccountBalanceByMintAddress(mint?.toBase58())
  const { status } = useProposalStatus(proposalAddress)
  const { metaData: daoMetaData } = useMetaData(daoAddress)
  const proposalFee = useProposalFee({ daoAddress })
  const isMultisigDAO = daoMetaData?.daoType === 'multisig-dao'

  const disabled = useMemo(() => {
    if (isMultisigDAO) return status !== 'Voting' || balance <= 0

    return status !== 'Voting' || !amount || !account.isAddress(proposalAddress)
  }, [amount, balance, isMultisigDAO, proposalAddress, status])

  const onVoteFor = useCallback(async () => {
    setLoadingFor(true)
    try {
      if ((!amount || !account.isAddress(proposalAddress)) && !isMultisigDAO)
        return
      const actualAmount = isMultisigDAO ? DEFAULT_VALUE_VOTE_MULTISIG : amount
      const voteAmount = utils.decimalize(actualAmount, decimals)
      const nextAmount = new BN(voteAmount.toString())
      const { txId } = await interDao.voteFor(
        proposalAddress,
        nextAmount,
        proposalFee,
      )
      dispatch(setVoteBidAmount(''))
      window.notify({
        type: 'success',
        description: 'Voted successfully. Click to view details!',
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
    } catch (error: any) {
      window.notify({
        type: 'error',
        description: error.message,
      })
    } finally {
      setLoadingFor(false)
    }
  }, [amount, decimals, dispatch, isMultisigDAO, proposalAddress, proposalFee])

  const onVoteAgainst = useCallback(async () => {
    setLoadingAgainst(true)
    try {
      if ((!amount || !account.isAddress(proposalAddress)) && !isMultisigDAO)
        return
      const actualAmount = isMultisigDAO ? DEFAULT_VALUE_VOTE_MULTISIG : amount
      const voteAmount = utils.decimalize(actualAmount, decimals)
      const nextAmount = new BN(voteAmount.toString())
      const { txId } = await interDao.voteAgainst(
        proposalAddress,
        nextAmount,
        proposalFee,
      )
      dispatch(setVoteBidAmount(''))
      window.notify({
        type: 'success',
        description: 'Voted successfully. Click to view details!',
        onClick: () => window.open(util.explorer(txId), '_blank'),
      })
    } catch (error: any) {
      window.notify({
        type: 'error',
        description: error.message,
      })
    } finally {
      setLoadingAgainst(false)
    }
  }, [amount, decimals, dispatch, isMultisigDAO, proposalAddress, proposalFee])

  return (
    <Fragment>
      {balance ? (
        <Row gutter={[16, 16]}>
          <Col span={isMultisigDAO ? 24 : 12}>
            <Button
              onClick={onVoteFor}
              type="primary"
              disabled={disabled}
              loading={loadingFor}
              block
              size="large"
              icon={<IonIcon name="thumbs-up-outline" />}
            >
              Vote For
            </Button>
          </Col>
          <Col span={isMultisigDAO ? 24 : 12}>
            <Button
              onClick={onVoteAgainst}
              type="primary"
              disabled={disabled}
              loading={loadingAgainst}
              block
              size="large"
              icon={<IonIcon name="thumbs-down-outline" />}
            >
              Vote Against
            </Button>
          </Col>
        </Row>
      ) : (
        <Button block size="large" type="primary" disabled={true}>
          Voted
        </Button>
      )}
    </Fragment>
  )
}

export default ActionVote