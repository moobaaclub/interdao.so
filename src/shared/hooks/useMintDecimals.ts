import { useCallback, useEffect, useState } from 'react'
import { useMint } from 'senhub/providers'

const useMintDecimals = (mintAddress: string) => {
  const [decimals, setDecimals] = useState<number | undefined>(undefined)
  const { getDecimals } = useMint()

  const fetchDecimals = useCallback(async () => {
    try {
      const decimals = await getDecimals(mintAddress)
      return setDecimals(decimals)
    } catch (er: any) {
      return setDecimals(undefined)
    }
  }, [mintAddress, getDecimals])

  useEffect(() => {
    fetchDecimals()
  }, [fetchDecimals])

  return decimals
}

export default useMintDecimals